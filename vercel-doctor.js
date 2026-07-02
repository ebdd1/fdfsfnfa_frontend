const https = require('https');

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const TEAM_ID = 'team_Ub6mQAmQRjlUM8QY01zmNKV4';
const PROJECT_ID = 'prj_w6aOa8jiplINhhyFJqYcdOm50rcz';

if (!VERCEL_TOKEN) {
  console.error('Error: VERCEL_TOKEN environment variable is not set.');
  process.exit(1);
}

function apiRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vercel.com',
      port: 443,
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(new Error(`API Error ${res.statusCode}: ${parsed.error?.message || data}`));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}. Status: ${res.statusCode}`));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.end();
  });
}

async function run() {
  try {
    // 1. Fetch Project Details (contains Env vars + Domains)
    const project = await apiRequest(`/v9/projects/${PROJECT_ID}?teamId=${TEAM_ID}`);

    // 2. Fetch Deployments (last 5)
    const deploymentsData = await apiRequest(`/v6/deployments?projectId=${PROJECT_ID}&teamId=${TEAM_ID}&limit=5`);
    const deployments = deploymentsData.deployments || [];

    // 3. Inspect Latest Deployment (if exists)
    let latestDetails = null;
    if (deployments.length > 0) {
      const latestId = deployments[0].uid;
      try {
        latestDetails = await apiRequest(`/v13/deployments/${latestId}?teamId=${TEAM_ID}`);
      } catch (err) {
        console.warn(`Warning: Could not fetch latest deployment details: ${err.message}`);
      }
    }

    // 4. Fetch Domains
    const domainsData = await apiRequest(`/v9/projects/${PROJECT_ID}/domains?teamId=${TEAM_ID}`);
    const domains = domainsData.domains || [];

    // 5. Fetch Drains
    let drains = [];
    try {
      const drainsData = await apiRequest(`/v1/drains?teamId=${TEAM_ID}`);
      drains = drainsData.drains || [];
    } catch (err) {
      // Drains endpoint might fail if token lacks permissions or on hobby accounts
      drains = null;
    }

    // Output all gathered data as JSON to be processed
    console.log(JSON.stringify({
      projectName: project.name,
      orgId: project.accountId,
      envVars: project.env || [],
      deployments: deployments,
      latestDetails: latestDetails,
      domains: domains,
      drains: drains
    }, null, 2));

  } catch (error) {
    console.error('Fatal Error:', error.message);
    process.exit(1);
  }
}

run();
