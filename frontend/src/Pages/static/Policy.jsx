import React from 'react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import './Policy.css';

const Policy = () => {
    useDocumentTitle('Privacy Policy | Kulture');

    return (
        <div className='policy-page'>
            <div className='policy-container'>
                <h1>Privacy Policy</h1>
                <p className='last-updated'>Last Updated: December, 2025</p>

                <section>
                    <h2>Introduction</h2>
                    <p>
                        Welcome to Kulture. We are committed to protecting your personal information and your right to privacy.
                        This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit
                        our website and use our services.
                    </p>
                </section>

                <section>
                    <h2>Information We Collect</h2>
                    <p>
                        We collect personal information that you voluntarily provide to us when you register on the website,
                        express an interest in obtaining information about us or our products and services, or otherwise contact us.
                    </p>
                    <p>
                        The personal information we collect may include your name, email address, phone number, shipping address,
                        billing address, and payment information.
                    </p>
                </section>

                <section>
                    <h2>How We Use Your Information</h2>
                    <p>
                        We use the information we collect or receive to facilitate account creation and the login process,
                        to send you marketing and promotional communications, to fulfill and manage your orders,
                        and to deliver targeted advertising to you.
                    </p>
                    <p>
                        We may also use your information to respond to user inquiries and offer support to users,
                        to send administrative information to you, and to protect our services.
                    </p>
                </section>

                <section>
                    <h2>Sharing Your Information</h2>
                    <p>
                        We may process or share your data based on the following legal bases: consent, legitimate interests,
                        performance of a contract, legal obligations, and vital interests.
                    </p>
                    <p>
                        We only share information with your consent, to comply with laws, to provide you with services,
                        to protect your rights, or to fulfill business obligations.
                    </p>
                </section>

                <section>
                    <h2>Data Security</h2>
                    <p>
                        We have implemented appropriate technical and organizational security measures designed to protect
                        the security of any personal information we process. However, please note that no electronic transmission
                        over the internet or information storage technology can be guaranteed to be 100% secure.
                    </p>
                </section>

                <section>
                    <h2>Your Privacy Rights</h2>
                    <p>
                        You may review, change, or terminate your account at any time. You have the right to request access
                        to the personal information we collect from you, request that we change or delete your personal information,
                        and opt-out of marketing communications.
                    </p>
                </section>

                <section>
                    <h2>Cookies and Tracking</h2>
                    <p>
                        We may use cookies and similar tracking technologies to access or store information.
                        You can set your browser to refuse all or some browser cookies, or to alert you when websites
                        set or access cookies.
                    </p>
                </section>

                <section>
                    <h2>Contact Us</h2>
                    <p>
                        If you have questions or comments about this Privacy Policy, please contact us at:
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

export default Policy;
