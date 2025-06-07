import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function GET() {
  try {
    const serverPath = path.join(process.cwd(), 'Speech_model_conv_pipeline_1805_');
    const pythonProcess = spawn('python3', ['start_server.py'], {
      cwd: serverPath,
      detached: true,
      stdio: 'ignore'
    });

    pythonProcess.unref();

    // Wait a moment for the server to start
    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json({ 
      success: true, 
      message: 'Flask server starting...',
      url: 'http://127.0.0.1:5000'
    });
  } catch (error) {
    console.error('Error starting server:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to start server' 
    }, { status: 500 });
  }
} 