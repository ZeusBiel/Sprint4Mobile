const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to check environment
const checkEnvironment = () => {
  console.log('🔍 Checking environment...');
  
  try {
    // Check Node.js version
    const nodeVersion = process.version;
    console.log(`✓ Node.js version: ${nodeVersion}`);

    // Check npm version
    const npmVersion = execSync('npm --version').toString().trim();
    console.log(`✓ npm version: ${npmVersion}`);

    // Check for Android SDK (if on Windows or Linux)
    if (process.platform !== 'darwin') {
      const androidHome = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
      if (!androidHome) {
        console.warn('⚠️ ANDROID_HOME not set. Android development might not work.');
      } else {
        console.log(`✓ Android SDK found at: ${androidHome}`);
      }
    }

    // Check for Xcode (if on macOS)
    if (process.platform === 'darwin') {
      try {
        execSync('xcode-select -p');
        console.log('✓ Xcode installed');
      } catch {
        console.warn('⚠️ Xcode not found. iOS development might not work.');
      }
    }

  } catch (error) {
    console.error('❌ Error checking environment:', error.message);
  }
};

// Function to clean project
const cleanProject = () => {
  console.log('🧹 Cleaning project...');
  
  const pathsToClean = [
    'node_modules',
    'yarn.lock',
    'package-lock.json',
    '.expo',
    'android/app/build',
    'android/.gradle',
    'ios/Pods',
    'ios/build'
  ];

  pathsToClean.forEach(pathToClean => {
    const fullPath = path.join(__dirname, '..', pathToClean);
    if (fs.existsSync(fullPath)) {
      console.log(`Cleaning ${pathToClean}...`);
      try {
        if (fs.lstatSync(fullPath).isDirectory()) {
          fs.rmSync(fullPath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(fullPath);
        }
      } catch (error) {
        console.error(`Error cleaning ${pathToClean}:`, error);
      }
    }
  });
};

// Function to install dependencies
const installDependencies = () => {
  console.log('📦 Installing dependencies...');
  
  try {
    execSync('npm cache clean --force', { stdio: 'inherit' });
    execSync('npm install', { stdio: 'inherit' });
    
    // Platform specific builds
    if (process.platform === 'win32' || process.platform === 'linux') {
      console.log('🤖 Setting up Android build...');
      execSync('cd android && ./gradlew clean', { stdio: 'inherit' });
    } else if (process.platform === 'darwin') {
      console.log('🍎 Setting up iOS build...');
      execSync('cd ios && pod install', { stdio: 'inherit' });
    }
  } catch (error) {
    console.error('❌ Error installing dependencies:', error.message);
    process.exit(1);
  }
};

// Main setup process
console.log('🚀 Starting project setup...\n');

checkEnvironment();
cleanProject();
installDependencies();

console.log('\n✅ Setup complete! You can now run:');
console.log('   npm start - to start the development server');
console.log('   npm run android - to run on Android');
console.log('   npm run ios - to run on iOS (Mac only)');