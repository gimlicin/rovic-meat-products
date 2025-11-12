<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * Redirect to the OAuth provider
     */
    public function redirect($provider)
    {
        $this->validateProvider($provider);
        
        return Socialite::driver($provider)->redirect();
    }

    /**
     * Handle the OAuth callback
     */
    public function callback($provider)
    {
        $this->validateProvider($provider);

        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'OAuth authentication failed. Please try again.');
        }

        // Check if user already exists with this provider
        $user = User::where('provider', $provider)
                   ->where('provider_id', $socialUser->getId())
                   ->first();

        if ($user) {
            // Update user info if needed
            $this->updateUserFromSocial($user, $socialUser);
            Auth::login($user);
            return redirect()->intended('/');
        }

        // Check if user exists with same email
        $existingUser = User::where('email', $socialUser->getEmail())->first();
        
        if ($existingUser) {
            // Link social account to existing user and update profile info
            $existingUser->update([
                'name' => $socialUser->getName() ?: $socialUser->getNickname() ?: $existingUser->name,
                'provider' => $provider,
                'provider_id' => $socialUser->getId(),
                'avatar' => $socialUser->getAvatar(),
                'provider_verified_at' => now(),
            ]);
            
            Auth::login($existingUser);
            return redirect()->intended('/');
        }

        // Create new user
        $user = $this->createUserFromSocial($socialUser, $provider);
        Auth::login($user);
        
        return redirect()->intended('/');
    }

    /**
     * Create a new user from social provider data
     */
    protected function createUserFromSocial($socialUser, $provider)
    {
        return User::create([
            'name' => $socialUser->getName() ?: $socialUser->getNickname() ?: 'User',
            'email' => $socialUser->getEmail(),
            'provider' => $provider,
            'provider_id' => $socialUser->getId(),
            'avatar' => $socialUser->getAvatar(),
            'email_verified_at' => now(), // Social accounts are considered verified
            'provider_verified_at' => now(),
            'password' => Hash::make(Str::random(32)), // Random password for social users
            'role' => User::ROLE_CUSTOMER, // Default role
        ]);
    }

    /**
     * Update existing user with social provider data
     */
    protected function updateUserFromSocial($user, $socialUser)
    {
        $user->update([
            'name' => $socialUser->getName() ?: $socialUser->getNickname() ?: $user->name,
            'avatar' => $socialUser->getAvatar(),
            'provider_verified_at' => now(),
        ]);
    }

    /**
     * Validate the OAuth provider
     */
    protected function validateProvider($provider)
    {
        if (!in_array($provider, ['facebook', 'google'])) {
            abort(404);
        }
    }
}
