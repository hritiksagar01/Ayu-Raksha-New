module.exports = {
  apps: [
    {
      name: 'ayu-raksha-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/opt/ayu-raksha-frontend',  // Adjust to your actual deployment path
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        // Use relative API path so browser calls same origin and Nginx proxies to backend
        NEXT_PUBLIC_API_URL: '/api',
        // Set your EC2 public IP or domain here (used for Supabase email redirects)
        NEXT_PUBLIC_SITE_URL: 'http://13.201.93.117',
        // Supabase config (these should already be in .env.local or similar)
        // NEXT_PUBLIC_SUPABASE_URL: 'https://dtkkqolzoosvdpyuxnqi.supabase.co',
        // NEXT_PUBLIC_SUPABASE_ANON_KEY: 'your-anon-key-here',
      },
    },
  ],
};
