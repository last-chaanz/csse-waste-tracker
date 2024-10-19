import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="mb-0 bg-gradient-to-r from-gray-900 to-gray-800 py-8 text-gray-300 shadow-lg">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div className="text-center md:text-left">
                        <h3 className="mb-4 text-2xl font-semibold tracking-wide text-gray-300">
                            Green<span className="font-bold text-green-500"> Stream</span>
                        </h3>
                        <p className="text-sm">Streamlining waste management for a cleaner future.</p>
                    </div>
                    <div className="text-center">
                        <h4 className="mb-4 text-lg font-medium">Contact Us</h4>
                        <div className="flex flex-col items-center space-y-2">
                            <p className="flex items-center text-sm">
                                <Mail className="mr-2 h-4 w-4 text-green-500" /> info@greenstream.com
                            </p>
                            <p className="flex items-center text-sm">
                                <Phone className="mr-2 h-4 w-4 text-green-500" /> +94 11 123 4567
                            </p>
                            <p className="flex items-center text-sm">
                                <MapPin className="mr-2 h-4 w-4 text-green-500" /> Colombo, Sri Lanka
                            </p>
                        </div>
                    </div>
                    <div className="text-center md:text-right">
                        <h4 className="mb-4 text-lg font-medium">Follow Us</h4>
                        <div className="flex justify-center space-x-4 md:justify-end">
                            <a href="#" className="group relative p-2" aria-label="Facebook">
                                <Facebook className="h-6 w-6 transition-colors duration-300 group-hover:text-green-500" />
                                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
                            </a>
                            <a href="#" className="group relative p-2" aria-label="Twitter">
                                <Twitter className="h-6 w-6 transition-colors duration-300 group-hover:text-green-500" />
                                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
                            </a>
                            <a href="#" className="group relative p-2" aria-label="Instagram">
                                <Instagram className="h-6 w-6 transition-colors duration-300 group-hover:text-green-500" />
                                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm">
                    <p>© {new Date().getFullYear()} Green Stream. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
