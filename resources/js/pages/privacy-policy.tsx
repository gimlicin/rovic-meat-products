import React from 'react';
import { Head } from '@inertiajs/react';
import ShopFrontLayout from '@/layouts/shop-front-layout';

export default function PrivacyPolicy() {
    return (
        <ShopFrontLayout>
            <Head title="Privacy Policy - Rovic Meat Products" />
            
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                    
                    <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
                        <p className="text-gray-600">
                            <strong>Last Updated:</strong> November 20, 2025
                        </p>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                            <p className="text-gray-700 mb-3">
                                When you use Rovic Meat Products, we collect the following information:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>Name, email address, and phone number when you register or place an order</li>
                                <li>Delivery address for order fulfillment</li>
                                <li>Payment information (processed securely through our payment providers)</li>
                                <li>Order history and preferences</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                            <p className="text-gray-700 mb-3">
                                We use your information to:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>Process and fulfill your orders</li>
                                <li>Communicate with you about your orders and account</li>
                                <li>Improve our products and services</li>
                                <li>Send promotional offers (with your consent)</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">3. Social Media Login</h2>
                            <p className="text-gray-700">
                                When you sign in using Facebook or Google, we receive your basic profile information 
                                (name, email address, and profile picture) as permitted by these platforms. We do not 
                                access or store your social media passwords.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">4. Information Sharing</h2>
                            <p className="text-gray-700 mb-3">
                                We do not sell your personal information. We may share your information with:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>Service providers who help us operate our business (e.g., payment processors, delivery services)</li>
                                <li>Law enforcement or regulatory authorities when required by law</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
                            <p className="text-gray-700">
                                We implement appropriate security measures to protect your personal information from 
                                unauthorized access, alteration, disclosure, or destruction. However, no method of 
                                transmission over the Internet is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
                            <p className="text-gray-700 mb-3">
                                You have the right to:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>Access and update your personal information</li>
                                <li>Request deletion of your account and data</li>
                                <li>Opt-out of promotional communications</li>
                                <li>Withdraw consent for data processing</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
                            <p className="text-gray-700">
                                We use cookies to enhance your browsing experience, analyze site traffic, and 
                                personalize content. You can control cookie preferences through your browser settings.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
                            <p className="text-gray-700">
                                Our services are not intended for children under 13 years of age. We do not knowingly 
                                collect personal information from children.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
                            <p className="text-gray-700">
                                We may update this Privacy Policy from time to time. We will notify you of any 
                                significant changes by posting the new policy on this page and updating the 
                                "Last Updated" date.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
                            <p className="text-gray-700 mb-2">
                                If you have any questions about this Privacy Policy, please contact us at:
                            </p>
                            <ul className="text-gray-700 space-y-1 ml-4">
                                <li><strong>Email:</strong> jeremiahsabiniano@gmail.com</li>
                                <li><strong>Business Name:</strong> Rovic Meat Products</li>
                                <li><strong>Website:</strong> https://rovic-meatshop-v2-492s.onrender.com</li>
                            </ul>
                        </section>

                        <div className="border-t pt-6 mt-8">
                            <p className="text-sm text-gray-500">
                                By using Rovic Meat Products, you acknowledge that you have read and understood 
                                this Privacy Policy and agree to its terms.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ShopFrontLayout>
    );
}
