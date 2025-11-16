<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cloudinary Configuration
    |--------------------------------------------------------------------------
    |
    | An HTTP or HTTPS URL to notify your application (a webhook) when the process of 
    | the upload is complete.
    |
    */

    'cloud_url' => env('CLOUDINARY_URL'),

    /**
     * Upload Preset From Cloudinary Dashboard
     *
     */
    'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET'),

    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
    'api_key'    => env('CLOUDINARY_API_KEY'),
    'api_secret' => env('CLOUDINARY_API_SECRET'),

    'secure' => true,

    /**
     * Cloudinary Notification URL
     */
    'notification_url' => env('CLOUDINARY_NOTIFICATION_URL'),
];
