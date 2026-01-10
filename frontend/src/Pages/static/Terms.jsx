import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import './Policy.css';

const Terms = () => {
    useDocumentTitle('Terms of Service | Kulture');
    const navigate = useNavigate();

    return (
        <div className='policy-page'>
            <div className='policy-container'>
                <div className="policy-title-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        ← Back
                    </button>
                    <h1>Terms of Service</h1>
                </div>
                <p className='last-updated'>Last Updated: December, 2025</p>

                <section>
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using Kulture's website and services, you accept and agree to be bound by the terms
                        and provision of this agreement. If you do not agree to these Terms of Service, please do not use our services.
                    </p>
                </section>

                <section>
                    <h2>2. Description of Service</h2>
                    <p>
                        Kulture provides an online marketplace for Malaysian cultural products, including traditional handicrafts,
                        clothing, art, and other cultural items. We also offer cultural tutorials and educational content to promote
                        Malaysian heritage and culture.
                    </p>
                </section>

                <section>
                    <h2>3. User Accounts</h2>
                    <p>
                        To access certain features of our service, you may be required to create an account. You are responsible
                        for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                    </p>
                    <p>
                        You agree to provide accurate, current, and complete information during registration and to update such information
                        to keep it accurate, current, and complete. Kulture reserves the right to suspend or terminate any account that
                        provides false, inaccurate, or incomplete information.
                    </p>
                </section>

                <section>
                    <h2>4. Product Purchases</h2>
                    <p>
                        All product prices are listed in Malaysian Ringgit (RM) and are subject to change without notice. We reserve
                        the right to modify product prices, discontinue products, or refuse service to anyone at any time.
                    </p>
                    <p>
                        By making a purchase, you agree to provide current, complete, and accurate purchase and account information.
                        You agree to promptly update your account and other information so that we can complete your transactions.
                    </p>
                </section>

                <section>
                    <h2>5. Payment and Billing</h2>
                    <p>
                        Payment for products must be made at the time of purchase. We accept various payment methods as indicated
                        during checkout. All transactions are processed securely, and we do not store your complete payment card information
                        on our servers.
                    </p>
                    <p>
                        You are responsible for all charges incurred under your account. If any payment is rejected or returned,
                        we reserve the right to cancel or suspend your order.
                    </p>
                </section>

                <section>
                    <h2>6. Shipping and Delivery</h2>
                    <p>
                        We aim to ship all orders within 3-5 business days. Delivery times may vary depending on your location.
                        Shipping costs are calculated based on the delivery address and will be displayed before you complete your purchase.
                    </p>
                    <p>
                        Risk of loss and title for products purchased pass to you upon delivery to the carrier. We are not responsible
                        for delays caused by shipping carriers or customs.
                    </p>
                </section>

                <section>
                    <h2>7. Intellectual Property</h2>
                    <p>
                        All content on this website, including but not limited to text, graphics, logos, images, and software,
                        is the property of Kulture or its content suppliers and is protected by international copyright laws.
                    </p>
                    <p>
                        You may not reproduce, distribute, modify, or create derivative works from any content on this website
                        without our express written permission.
                    </p>
                </section>

                <section>
                    <h2>8. User Conduct</h2>
                    <p>
                        You agree not to use our services for any unlawful purpose or in any way that could damage, disable,
                        overburden, or impair our website. You may not attempt to gain unauthorized access to any portion of
                        the website or any systems or networks connected to the website.
                    </p>
                    <p>
                        You shall not upload, post, or transmit any content that is unlawful, threatening, abusive, defamatory,
                        obscene, or otherwise objectionable.
                    </p>
                </section>

                <section>
                    <h2>9. Reviews and Comments</h2>
                    <p>
                        Users may post reviews and comments about products and services. All reviews must be honest and based on
                        your personal experience. You grant Kulture a non-exclusive, royalty-free license to use, reproduce, and
                        publish your reviews.
                    </p>
                    <p>
                        Kulture reserves the right to remove or edit any reviews that violate these terms or are deemed inappropriate.
                    </p>
                </section>

                <section>
                    <h2>10. Limitation of Liability</h2>
                    <p>
                        Kulture shall not be liable for any direct, indirect, incidental, special, or consequential damages
                        resulting from the use or inability to use our services, unauthorized access to your data, or any other
                        matter relating to our services.
                    </p>
                    <p>
                        Our total liability to you for any claim arising from or related to these terms shall not exceed the
                        amount you paid to us in the 12 months preceding the claim.
                    </p>
                </section>

                <section>
                    <h2>11. Indemnification</h2>
                    <p>
                        You agree to indemnify and hold harmless Kulture, its officers, directors, employees, and agents from
                        any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of
                        our services or violation of these terms.
                    </p>
                </section>

                <section>
                    <h2>12. Privacy</h2>
                    <p>
                        Your use of our services is also governed by our Privacy Policy. Please review our Privacy Policy to
                        understand our practices regarding the collection and use of your personal information.
                    </p>
                </section>

                <section>
                    <h2>13. Changes to Terms</h2>
                    <p>
                        Kulture reserves the right to modify these Terms of Service at any time. We will notify users of any
                        material changes by posting the new terms on this page with an updated "Last Updated" date. Your continued
                        use of our services after any changes constitutes acceptance of the new terms.
                    </p>
                </section>

                <section>
                    <h2>14. Governing Law</h2>
                    <p>
                        These Terms of Service shall be governed by and construed in accordance with the laws of Malaysia,
                        without regard to its conflict of law provisions. Any disputes arising from these terms shall be resolved
                        in the courts of Malaysia.
                    </p>
                </section>

                <section>
                    <h2>15. Contact Information</h2>
                    <p>
                        If you have any questions about these Terms of Service, please contact us at:
                    </p>
                    <p>
                        <strong>Email:</strong> kulture05@gmail.com<br />
                        <strong>Phone:</strong> +60 11 5503 7268<br />
                        <strong>Address:</strong> 77A Batu 12 1/2 Jalan Kaki Bukit, 02200 Kaki Bukit, Perlis
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Terms;
