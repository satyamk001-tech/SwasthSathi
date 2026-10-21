import React from 'react';
import { Heart, Github, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">SwasthSathi</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your AI-powered health companion for better healthcare decisions.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-sm text-muted-foreground hover:text-primary transition-colors">AI Health Chat</a></li>
              <li><a href="#hospitals" className="text-sm text-muted-foreground hover:text-primary transition-colors">Find Hospitals</a></li>
              <li><a href="#lab" className="text-sm text-muted-foreground hover:text-primary transition-colors">Lab Scanner</a></li>
              <li><a href="#risk" className="text-sm text-muted-foreground hover:text-primary transition-colors">Risk Calculator</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Emergency</h4>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">National Emergency: 102</li>
              <li className="text-sm text-muted-foreground">Ambulance: 108</li>
              <li className="text-sm text-muted-foreground">Police: 100</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 SwasthSathi. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
