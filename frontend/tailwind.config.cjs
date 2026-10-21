/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			border: 'hsl(var(--border, 214.3 31.8% 91.4%))',
  			input: 'hsl(var(--input, 214.3 31.8% 91.4%))',
  			ring: 'hsl(var(--ring, 222.2 84% 4.9%))',
  			background: '#faf8ff',
  			foreground: '#131b2e',
  			surface: '#faf8ff',
  			'surface-dim': '#d2d9f4',
  			'surface-bright': '#faf8ff',
  			'surface-container-lowest': '#ffffff',
  			'surface-container-low': '#f2f3ff',
  			'surface-container': '#eaedff',
  			'surface-container-high': '#e2e7ff',
  			'surface-container-highest': '#dae2fd',
  			'surface-variant': '#dae2fd',
  			'surface-tint': '#006398',
  			'on-background': '#131b2e',
  			'on-surface': '#131b2e',
  			'on-surface-variant': '#3f4850',
  			'inverse-surface': '#283044',
  			'inverse-on-surface': '#eef0ff',
  			outline: '#707881',
  			'outline-variant': '#bfc7d2',
  			primary: {
  				DEFAULT: '#006194',
  				foreground: '#ffffff'
  			},
  			'primary-container': '#007bb9',
  			'on-primary-container': '#fdfcff',
  			'primary-fixed': '#cce5ff',
  			'primary-fixed-dim': '#93ccff',
  			'on-primary': '#ffffff',
  			'on-primary-fixed': '#001d31',
  			'on-primary-fixed-variant': '#004b73',
  			'inverse-primary': '#93ccff',
  			secondary: {
  				DEFAULT: '#006a61',
  				foreground: '#ffffff'
  			},
  			'secondary-container': '#86f2e4',
  			'on-secondary-container': '#006f66',
  			'secondary-fixed': '#89f5e7',
  			'secondary-fixed-dim': '#6bd8cb',
  			'on-secondary': '#ffffff',
  			'on-secondary-fixed': '#00201d',
  			'on-secondary-fixed-variant': '#005049',
  			tertiary: {
  				DEFAULT: '#ba0035',
  				foreground: '#ffffff'
  			},
  			'tertiary-container': '#e21e49',
  			'on-tertiary-container': '#fffbff',
  			'tertiary-fixed': '#ffdada',
  			'tertiary-fixed-dim': '#ffb3b6',
  			'on-tertiary': '#ffffff',
  			'on-tertiary-fixed': '#40000c',
  			'on-tertiary-fixed-variant': '#920028',
  			error: '#ba1a1a',
  			'error-container': '#ffdad6',
  			'on-error': '#ffffff',
  			'on-error-container': '#93000a',
  			destructive: {
  				DEFAULT: '#ba1a1a',
  				foreground: '#ffffff'
  			},
  			muted: {
  				DEFAULT: '#f2f3ff',
  				foreground: '#64748b'
  			},
  			accent: {
  				DEFAULT: '#eaedff',
  				foreground: '#006194'
  			},
  			popover: {
  				DEFAULT: '#ffffff',
  				foreground: '#131b2e'
  			},
  			card: {
  				DEFAULT: '#ffffff',
  				foreground: '#131b2e'
  			}
  		},
  		spacing: {
  			margin: '1rem',
  			'space-xs': '0.25rem',
  			'space-sm': '0.5rem',
  			'space-md': '1rem',
  			'space-lg': '1.5rem',
  			'space-xl': '2.5rem'
  		},
  		borderRadius: {
  			lg: '0.75rem',
  			md: '0.5rem',
  			sm: '0.25rem',
  			xl: '1rem',
  			'2xl': '1.25rem'
  		},
  		fontFamily: {
  			sans: ['"Plus Jakarta Sans"', 'Sora', 'system-ui', 'sans-serif'],
  			headline: ['"Plus Jakarta Sans"', 'sans-serif'],
  			body: ['"Plus Jakarta Sans"', 'sans-serif']
  		},
  		fontSize: {
  			'headline-sm': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
  			'headline-md': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
  			'headline-lg': ['2rem', { lineHeight: '2.5rem', fontWeight: '600' }],
  			'headline-lg-mobile': ['1.625rem', { lineHeight: '2.125rem', fontWeight: '600' }],
  			'headline-xl': ['2.5rem', { lineHeight: '3rem', fontWeight: '700' }],
  			'body-sm': ['0.875rem', { lineHeight: '1.375rem', fontWeight: '400' }],
  			'body-md': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
  			'body-lg': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '400' }],
  			'label-sm': ['0.6875rem', { lineHeight: '0.875rem', fontWeight: '500' }],
  			'label-md': ['0.75rem', { lineHeight: '1rem', fontWeight: '600' }],
  			'label-lg': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '600' }],
  			'data-metric': ['1.75rem', { lineHeight: '2rem', fontWeight: '700' }]
  		},
  		animation: {
  			'fade-in': 'fade-in 0.3s ease-out',
  			'slide-up': 'slide-up 0.3s ease-out',
  			'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  		},
  		keyframes: {
  			'fade-in': {
  				'0%': { opacity: '0' },
  				'100%': { opacity: '1' }
  			},
  			'slide-up': {
  				'0%': { transform: 'translateY(12px)', opacity: '0' },
  				'100%': { transform: 'translateY(0)', opacity: '1' }
  			}
  		}
  	}
  },
  plugins: []
};
