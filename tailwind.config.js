/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: '#fefae0',
  			foreground: '#283618',
  			card: {
  				DEFAULT: '#fefae0',
  				foreground: '#283618'
  			},
  			popover: {
  				DEFAULT: '#fefae0',
  				foreground: '#283618'
  			},
  			primary: {
  				DEFAULT: '#606c38',
  				foreground: '#fefae0'
  			},
  			secondary: {
  				DEFAULT: '#dda15e',
  				foreground: '#283618'
  			},
  			muted: {
  				DEFAULT: '#bc6c25',
  				foreground: '#fefae0'
  			},
  			accent: {
  				DEFAULT: '#dda15e',
  				foreground: '#283618'
  			},
  			destructive: {
  				DEFAULT: '#bc6c25',
  				foreground: '#fefae0'
  			},
  			border: '#606c38',
  			input: '#606c38',
  			ring: '#283618',
  			chart: {
  				'1': '#606c38',
  				'2': '#283618',
  				'3': '#dda15e',
  				'4': '#bc6c25',
  				'5': '#fefae0'
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
