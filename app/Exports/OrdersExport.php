<?php

namespace App\Exports;

use OpenSpout\Common\Entity\Style\Style;
use OpenSpout\Common\Entity\Style\Color;
use OpenSpout\Common\Entity\Row;
use OpenSpout\Writer\XLSX\Writer;
use ZipArchive;

class OrdersExport
{
    protected $orders;

    public function __construct($orders)
    {
        $this->orders = $orders;
    }

    public function export($filePath)
    {
        $writer = new Writer();
        $writer->openToFile($filePath);

        // Create header style - Bold, larger font, with background color
        $headerStyle = new Style();
        $headerStyle->setFontBold();
        $headerStyle->setFontSize(12);
        $headerStyle->setBackgroundColor(Color::rgb(220, 38, 38)); // Red background
        $headerStyle->setFontColor(Color::WHITE);

        // Header row
        $headerRow = Row::fromValues(
            [
                'Order ID',
                'Customer',
                'Email',
                'Phone',
                'Status',
                'Payment Status',
                'Payment Method',
                'Delivery Type',
                'Total Amount',
                'Items Count',
                'Is Bulk Order',
                'Senior/PWD Discount',
                'Order Date',
            ],
            $headerStyle
        );
        
        $writer->addRow($headerRow);

        // Data rows
        $dataStyle = new Style();
        $dataStyle->setFontSize(11);

        foreach ($this->orders as $order) {
            $row = Row::fromValues(
                [
                    $order['Order ID'],
                    $order['Customer'],
                    $order['Email'],
                    $order['Phone'],
                    $order['Status'],
                    $order['Payment Status'],
                    $order['Payment Method'],
                    $order['Delivery Type'],
                    $order['Total Amount'],
                    $order['Items Count'],
                    $order['Is Bulk Order'],
                    $order['Senior/PWD Discount'],
                    $order['Order Date'],
                ],
                $dataStyle
            );

            $writer->addRow($row);
        }

        $writer->close();
        
        // Add column widths by modifying the Excel XML
        $this->addColumnWidths($filePath);
    }
    
    private function addColumnWidths($filePath)
    {
        $zip = new ZipArchive();
        if ($zip->open($filePath) === TRUE) {
            // Read the worksheet XML
            $worksheetXml = $zip->getFromName('xl/worksheets/sheet1.xml');
            
            if ($worksheetXml !== false) {
                // Define column widths (A to M)
                $columnWidths = [
                    'A' => 12,  // Order ID
                    'B' => 20,  // Customer
                    'C' => 28,  // Email
                    'D' => 15,  // Phone
                    'E' => 15,  // Status
                    'F' => 18,  // Payment Status
                    'G' => 18,  // Payment Method
                    'H' => 15,  // Delivery Type
                    'I' => 14,  // Total Amount
                    'J' => 12,  // Items Count
                    'K' => 14,  // Is Bulk Order
                    'L' => 22,  // Senior/PWD Discount
                    'M' => 20,  // Order Date
                ];
                
                // Build cols XML
                $colsXml = '<cols>';
                $colNum = 1;
                foreach ($columnWidths as $col => $width) {
                    $colsXml .= sprintf(
                        '<col min="%d" max="%d" width="%s" customWidth="1"/>',
                        $colNum,
                        $colNum,
                        $width
                    );
                    $colNum++;
                }
                $colsXml .= '</cols>';
                
                // Insert cols after sheetData opening tag
                $worksheetXml = str_replace(
                    '<sheetData>',
                    $colsXml . '<sheetData>',
                    $worksheetXml
                );
                
                // Update the file in the zip
                $zip->deleteName('xl/worksheets/sheet1.xml');
                $zip->addFromString('xl/worksheets/sheet1.xml', $worksheetXml);
            }
            
            $zip->close();
        }
    }
}
