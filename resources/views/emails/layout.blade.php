<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title') - Rovic Meatshop</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background-color: #dc2626;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .content {
            padding: 40px 30px;
        }
        .content h2 {
            color: #dc2626;
            font-size: 24px;
            margin-top: 0;
            margin-bottom: 20px;
        }
        .content p {
            margin: 15px 0;
            font-size: 16px;
        }
        .order-info {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        .order-info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .order-info-row:last-child {
            border-bottom: none;
        }
        .order-info-label {
            font-weight: 600;
            color: #6b7280;
        }
        .order-info-value {
            color: #111827;
            font-weight: 500;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
        }
        .items-table th {
            background-color: #f9fafb;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #6b7280;
            border-bottom: 2px solid #e5e7eb;
        }
        .items-table td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
        }
        .items-table tr:last-child td {
            border-bottom: none;
        }
        .total-row {
            background-color: #fef2f2;
            font-weight: 600;
            font-size: 18px;
        }
        .button {
            display: inline-block;
            padding: 14px 28px;
            background-color: #dc2626;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
            text-align: center;
        }
        .button:hover {
            background-color: #b91c1c;
        }
        .alert {
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .alert-success {
            background-color: #d1fae5;
            border-left: 4px solid #10b981;
            color: #065f46;
        }
        .alert-warning {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            color: #92400e;
        }
        .alert-danger {
            background-color: #fee2e2;
            border-left: 4px solid #ef4444;
            color: #991b1b;
        }
        .alert-info {
            background-color: #dbeafe;
            border-left: 4px solid #3b82f6;
            color: #1e40af;
        }
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
        }
        .footer a {
            color: #dc2626;
            text-decoration: none;
        }
        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 600;
        }
        .status-pending {
            background-color: #fef3c7;
            color: #92400e;
        }
        .status-confirmed {
            background-color: #d1fae5;
            color: #065f46;
        }
        .status-preparing {
            background-color: #fed7aa;
            color: #9a3412;
        }
        .status-ready {
            background-color: #dbeafe;
            color: #1e40af;
        }
        .status-completed {
            background-color: #d1fae5;
            color: #065f46;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🥩 Rovic Meatshop</h1>
        </div>
        
        <div class="content">
            @yield('content')
        </div>
        
        <div class="footer">
            <p><strong>Rovic Meatshop</strong></p>
            <p>Your trusted source for quality meat products</p>
            <p>
                <a href="{{ config('app.url') }}">Visit Our Website</a> | 
                <a href="{{ config('app.url') }}/contact">Contact Us</a>
            </p>
            <p style="margin-top: 20px; color: #9ca3af; font-size: 12px;">
                This email was sent from Rovic Meatshop. If you have any questions, please contact our customer support.
            </p>
        </div>
    </div>
</body>
</html>
