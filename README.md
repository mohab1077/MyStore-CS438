<h1>My Shop Project</h1>

<p>
  This is a full-stack MERN project built using MongoDB, Express.js, React, and Node.js.
</p>

<hr />

<h2>1. What You Need Before Running The Project</h2>

<p>Before you run the project, install these tools:</p>

<ul>
  <li>
    <strong>Node.js</strong>:
    <a href="https://nodejs.org/en/download" target="_blank">
      Download Node.js
    </a>
  </li>




  <li>
    <strong>MongoDB </strong>:
     <a href="https://www.mongodb.com/try/download/community" target="_blank">
    Download MongoDB Local Server
  </a>
  </li>
</ul>

<p>
  Node.js is used to run JavaScript on the server, Git is used to download and manage the project code,
  VS Code is used to edit the code, and MongoDB Atlas is used as the database.
</p>

<hr />

<h2>2. Check Node.js And npm</h2>

<p>After installing Node.js, open the terminal and run:</p>

<pre><code>node -v</code></pre>

<p>Then run:</p>

<pre><code>npm -v</code></pre>

<p>
  If both commands show version numbers, then Node.js and npm are installed correctly.
</p>

<hr />

<h2>3. Clone The Project</h2>

<p>Open the terminal and run:</p>

<pre><code>git clone REPOSITORY_LINK</code></pre>

<p>Then enter the project folder:</p>

<pre><code>cd YOUR_PROJECT_FOLDER</code></pre>

<hr />

<h2>4. Project Structure</h2>

<p>The project has two main folders:</p>

<pre><code>project-name/
│
├── backend/
│   ├── src/
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── .env
│   └── package.json
│
└── README.md</code></pre>

<p>
  The <strong>backend</strong> folder contains the server code.
  The <strong>frontend</strong> folder contains the React website code.
</p>

<hr />

<h2>5. Backend Setup</h2>

<p>Go to the backend folder:</p>

<pre><code>cd backend</code></pre>

<p>Install backend packages:</p>

<pre><code>npm install</code></pre>

<p>
  The backend already has a <strong>.env</strong> file.
  You only need to open it and change the values.
</p>

<p>Example backend <strong>.env</strong>:</p>

<pre><code>DATABASE_URL="mongodb://localhost:27017/cs438"
jwtpass = "anypassword"</code></pre>

<p>Explanation:</p>

<ul>
 
  <li><strong>DATABASE_URL</strong>: your MongoDB database connection string.</li>
  <li><strong>JWT_SECRET</strong>: secret key used for authentication.</li>
 
</ul>

<p>Run the backend:</p>

<pre><code>npm run dev</code></pre>

<p>The backend should now run on:</p>

<pre><code>http://localhost:5001</code></pre>
<p>
  You can also check the backend terminal.
  If the server starts successfully, the terminal should display the backend URL.
</p>
<hr />

<h2>6. Frontend Setup</h2>

<p>Open a new terminal. Do not close the backend terminal.</p>

<p>Go to the frontend folder:</p>

<pre><code>cd frontend</code></pre>

<p>Install frontend packages:</p>

<pre><code>npm install</code></pre>

<p>
  The frontend already has a <strong>.env</strong> file.
  Open it and update the API link.
</p>

<p>Example frontend <strong>.env</strong>:</p>

<pre><code>VITE_API_URL=http://localhost:5001</code></pre>
<p>
  The <strong>VITE_API_URL</strong> is the backend server URL.
</p>

<p>
  The frontend uses this URL to connect and send requests to the backend API.
</p>
<p>
  In Vite, frontend environment variables must start with <strong>VITE_</strong>.
</p>

<p>Run the frontend:</p>

<pre><code>npm run dev</code></pre>

<p>The frontend should now run on:</p>

<pre><code>http://localhost:5173</code></pre>

<p>
  You can also check the frontend terminal.
  If the server starts successfully, the terminal should display the frontend URL.
</p>

<hr />
<h2>7.MongoDB Local Setup</h2>

<p>
  This section explains how to install and run MongoDB locally on your computer.
</p>

<h3>1. Download MongoDB Community Server</h3>

<p>
  Go to the official MongoDB Community Server download page:
</p>

<p>
  <a href="https://www.mongodb.com/try/download/community" target="_blank">
    Download MongoDB Community Server
  </a>
</p>

<h3>2. Install MongoDB</h3>

<p>
  After downloading MongoDB, open the installer and complete the installation steps.
</p>

<p>
  During installation, keep the default options selected.
</p>

<h3>3. Start MongoDB Locally</h3>

<p>
  After installation, MongoDB should run as a local service.
</p>

<p>
  The default local MongoDB URL is:
</p>

<pre><code>mongodb://127.0.0.1:27017</code></pre>

<h3>4. Add MongoDB URL To Backend .env</h3>

<p>
  Open the backend <strong>.env</strong> file and add your local MongoDB connection string.
</p>

<pre><code>DATABASE_URL=mongodb://127.0.0.1:27017/your_database_name</code></pre>

<p>
  Replace <strong>your_database_name</strong> with your real database name.
</p>

<p>Example:</p>

<pre><code>DATABASE_URL=mongodb://127.0.0.1:27017/mern_project</code></pre>

<h3>5. Run The Backend</h3>

<p>
  After setting the MongoDB URL, run the backend:
</p>

<pre><code>npm run dev</code></pre>

<p>
  If everything is correct, the backend terminal should show that the database is connected.
</p>

<hr />

<h2>8. How To Run The Full Project</h2>

<p>You need two terminals open at the same time.</p>

<h3>Terminal 1: Backend</h3>

<pre><code>cd backend
npm run dev</code></pre>

<h3>Terminal 2: Frontend</h3>

<pre><code>cd frontend
npm run dev</code></pre>

<p>After that, open the browser and go to frontend url:</p>

<pre><code>http://localhost:5173</code></pre>

<hr />


<h2>9. Important Notes About .env Files</h2>

<p>
  The project already includes <strong>.env</strong> files, but each developer must edit them with their own local values.
</p>

<p>Never upload real secret values to GitHub, such as:</p>

<ul>
  <li>Database passwords</li>
  <li>JWT secret keys</li>
  <li>API keys</li>
</ul>



<hr />



<h2>10. Useful Official Links</h2>

<ul>
  <li>
    Node.js:
    <a href="https://nodejs.org/en/download" target="_blank">
      https://nodejs.org/en/download
    </a>
  </li>



<li>
  MongoDB Community Server:
  <a href="https://www.mongodb.com/try/download/community" target="_blank">
    https://www.mongodb.com/try/download/community
  </a>
</li>
</ul>



