import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
// Uncomment the line below if you want to use route-specific CORS instead of global middleware
// import { withCors } from '@/lib/cors';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: '22bcs086@iiitdw.ac.in',
      subject: `New Website Enquiry from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Message: ${message}
      `,
      html: `
<h2>Website Enquiry</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Message:</strong> ${message}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

// Alternative approach: Use route-specific CORS (uncomment if needed)
// export const POST = withCors(async (request: NextRequest) => {
//   // Your POST logic here
//   return NextResponse.json({ message: 'Success' });
// });

// Handle OPTIONS requests explicitly if needed
export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
} 