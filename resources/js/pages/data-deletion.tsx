import React from 'react';
import { Head } from '@inertiajs/react';
import ShopFrontLayout from '@/layouts/shop-front-layout';

export default function DataDeletion() {
    return (
        <ShopFrontLayout>
            <Head title="Data Deletion Request - Rovic Meat Products" />
            
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-8">Data Deletion Request</h1>
                    
                    <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Request Account & Data Deletion</h2>
                            <p className="text-gray-700 mb-4">
                                At Rovic Meat Products, we respect your privacy and your right to control your personal data. 
                                If you wish to delete your account and all associated data from our system, we will process 
                                your request promptly.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">What Data Will Be Deleted?</h2>
                            <p className="text-gray-700 mb-3">
                                When you request account deletion, we will permanently remove:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>Your account information (name, email, phone number)</li>
                                <li>Your delivery addresses</li>
                                <li>Your order history and preferences</li>
                                <li>Any saved cart items</li>
                                <li>Social media login connections (Facebook, Google)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">What Data May Be Retained?</h2>
                            <p className="text-gray-700 mb-3">
                                We may retain certain data for legal and business purposes:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>Transaction records (for accounting and tax purposes) - <strong>kept for 7 years</strong></li>
                                <li>Legal compliance records (if required by law)</li>
                                <li>Aggregated, anonymized data for analytics (cannot identify you)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">How to Request Deletion</h2>
                            <p className="text-gray-700 mb-4">
                                To request deletion of your account and data, please contact us using one of the following methods:
                            </p>
                            
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
                                <h3 className="font-semibold text-lg text-gray-900">Contact Information:</h3>
                                
                                <div>
                                    <p className="font-semibold text-gray-700">Email:</p>
                                    <a href="mailto:jeremiahsabiniano@gmail.com?subject=Data%20Deletion%20Request" 
                                       className="text-blue-600 hover:text-blue-800 underline">
                                        jeremiahsabiniano@gmail.com
                                    </a>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Subject: "Data Deletion Request"
                                    </p>
                                </div>

                                <div className="border-t pt-4">
                                    <p className="font-semibold text-gray-700 mb-2">Include in your request:</p>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-sm">
                                        <li>Your full name</li>
                                        <li>Email address associated with your account</li>
                                        <li>Phone number (if registered)</li>
                                        <li>Login method (Email/Facebook/Google)</li>
                                        <li>Confirmation: "I request deletion of my account and all associated data"</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Processing Timeline</h2>
                            <p className="text-gray-700 mb-3">
                                Once we receive your deletion request:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li><strong>Within 24 hours:</strong> We will acknowledge receipt of your request</li>
                                <li><strong>Within 7 business days:</strong> Your account and data will be permanently deleted</li>
                                <li><strong>Confirmation:</strong> You will receive a confirmation email once deletion is complete</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Facebook Login Users</h2>
                            <p className="text-gray-700 mb-4">
                                If you logged in using Facebook or Google, deleting your Rovic Meat Products account will:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>Remove all data stored in our system</li>
                                <li>Disconnect the social media login integration</li>
                                <li>Not affect your Facebook or Google account (only the connection to our app)</li>
                            </ul>
                            <p className="text-gray-700 mt-4">
                                To also revoke our app's access to your Facebook/Google account:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-2">
                                <li><strong>Facebook:</strong> Go to Settings → Apps and Websites → Remove "Rovic Meat Products"</li>
                                <li><strong>Google:</strong> Go to myaccount.google.com → Security → Third-party apps → Remove access</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Questions?</h2>
                            <p className="text-gray-700">
                                If you have any questions about data deletion or your privacy rights, please contact us at:
                            </p>
                            <p className="text-gray-700 mt-2">
                                <strong>Email:</strong> <a href="mailto:jeremiahsabiniano@gmail.com" className="text-blue-600 hover:text-blue-800 underline">jeremiahsabiniano@gmail.com</a>
                            </p>
                        </section>

                        <div className="border-t pt-6 mt-8">
                            <p className="text-sm text-gray-500">
                                This page complies with Facebook's Platform Policy and GDPR requirements for user data deletion.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ShopFrontLayout>
    );
}
