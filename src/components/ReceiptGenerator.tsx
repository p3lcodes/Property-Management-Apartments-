import React, { useRef, useState } from 'react';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Printer } from 'lucide-react';
import { User } from '@/lib/store';

interface ReceiptGeneratorProps {
    tenant: User;
    landlordName: string;
    propertyName: string;
    isOpen: boolean;
    onClose: () => void;
    type: 'receipt' | 'vacate' | 'warning';
}

const ReceiptGenerator: React.FC<ReceiptGeneratorProps> = ({ tenant, landlordName, propertyName, isOpen, onClose, type }) => {
    const reportRef = useRef<HTMLDivElement>(null);
    const [amount, setAmount] = useState(tenant.rentAmount?.toString() || '0');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [month, setMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
    const [noticeDays, setNoticeDays] = useState('30');

    const handleDownload = () => {
        const element = reportRef.current;
        const opt = {
            margin: 0.5,
            filename: `${type}_${tenant.fullName}_${date}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    // --- TEMPLATES ---

    const ReceiptTemplate = () => (
        <div className="p-8 bg-white text-black border-2 border-gray-100 max-w-[800px] mx-auto text-sm" id="pdf-content">
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-widest text-[#1a365d]">{propertyName}</h1>
                    <p className="text-gray-600">Property Management Office</p>
                    <p className="text-gray-600">Phone: {landlordName === 'Victor Mwangi Gichuru' ? '0768 141 129' : '0700 000 000'}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-extrabold text-gray-200 uppercase">Receipt</h2>
                    <p className="font-mono mt-2">NO: #{Math.floor(100000 + Math.random() * 900000)}</p>
                    <p className="font-mono">DATE: {date}</p>
                </div>
            </div>

            {/* Bill To */}
            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <p className="text-xs uppercase text-gray-400 font-bold mb-1">Received From</p>
                    <p className="text-lg font-bold">{tenant.fullName}</p>
                    <p>Phone: {tenant.phone}</p>
                    <div className="mt-2 inline-block bg-gray-100 px-3 py-1 rounded">
                         <span className="font-bold text-gray-600">Unit: {tenant.unitNumber}</span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs uppercase text-gray-400 font-bold mb-1">Payment For</p>
                    <p className="text-lg font-bold">Rent - {month}</p>
                    <p className="text-gray-500 italic">Managed by {landlordName}</p>
                </div>
            </div>

            {/* Table */}
            <table className="w-full mb-8">
                <thead className="bg-[#1a365d] text-white">
                    <tr>
                        <th className="p-3 text-left">Description</th>
                        <th className="p-3 text-right">Amount (KES)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b">
                        <td className="p-4 font-medium">
                            Monthly Rent Payment for {month} <br/>
                            <span className="text-xs text-gray-500 font-normal">Property: {propertyName} | Unit: {tenant.unitNumber}</span>
                        </td>
                        <td className="p-4 text-right font-bold">{parseInt(amount).toLocaleString()}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr className="bg-gray-50">
                        <td className="p-3 font-bold text-right text-lg">TOTAL PAID</td>
                        <td className="p-3 text-right font-bold text-lg text-[#1a365d]">KES {parseInt(amount).toLocaleString()}</td>
                    </tr>
                </tfoot>
            </table>

            {/* Footer */}
            <div className="border-t pt-4 mt-12 flex justify-between items-end">
                <div className="text-xs text-gray-400">
                    <p>This is a computer generated receipt.</p>
                    <p>Generated via P3L Property Manager</p>
                </div>
                <div className="text-center">
                    <div className="h-16 w-32 border-b border-dashed border-gray-400 mb-2"></div>
                    <p className="text-xs font-bold uppercase">Authorized Signature</p>
                </div>
            </div>
        </div>
    );

    const VacateTemplate = () => (
        <div className="p-12 bg-white text-black max-w-[800px] mx-auto font-serif" id="pdf-content">
             <div className="text-center mb-12">
                 <h1 className="text-3xl font-bold uppercase underline decoration-double decoration-2 underline-offset-4">Notice to Vacate</h1>
             </div>

             <div className="mb-8">
                 <p className="mb-2"><strong>Date:</strong> {date}</p>
                 <p className="mb-2"><strong>To Tenant:</strong> {tenant.fullName}</p>
                 <p className="mb-2"><strong>Unit:</strong> {tenant.unitNumber}</p>
                 <p><strong>Property:</strong> {propertyName}</p>
             </div>

             <div className="space-y-6 text-justify leading-relaxed">
                 <p>
                     Dear {tenant.fullName},
                 </p>
                 <p>
                     This letter serves as a formal notice to vacate the premises located at <strong>{propertyName}, Unit {tenant.unitNumber}</strong>.
                 </p>
                 <p>
                     You are hereby requested to vacate and surrender possession of the property within <strong>{noticeDays} days</strong> from the date of this letter.
                 </p>
                 <p>
                     Please ensure all your personal belongings are removed and the property is left in a clean condition to facilitate the return of your security deposit (if applicable), subject to inspection for any damages beyond normal wear and tear.
                 </p>
                 <p>
                     Kindly arrange a time for the final inspection and key handover on or before the expiry of this notice period.
                 </p>
             </div>

             <div className="mt-16">
                 <p>Sincerely,</p>
                 <br />
                 <p className="font-bold">{landlordName}</p>
                 <p>Landlord / Property Manager</p>
             </div>
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Generate {type === 'receipt' ? 'Rent Receipt' : 'Notice Document'}</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Controls */}
                    <div className="w-full md:w-1/3 space-y-4 p-4 border rounded-lg bg-gray-50 h-fit">
                        <div>
                            <Label>Date</Label>
                            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>
                        
                        {type === 'receipt' && (
                            <>
                            <div>
                                <Label>Amount (KES)</Label>
                                <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                            </div>
                            <div>
                                <Label>Month Paid For</Label>
                                <Select value={month} onValueChange={setMonth}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                            <SelectItem key={m} value={m}>{m}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            </>
                        )}

                        {type === 'vacate' && (
                             <div>
                                <Label>Notice Period (Days)</Label>
                                <Input type="number" value={noticeDays} onChange={(e) => setNoticeDays(e.target.value)} />
                            </div>
                        )}

                        <Button className="w-full mt-4 gap-2" onClick={handleDownload}>
                            <Download size={16} /> Download PDF
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                            Download and share via WhatsApp manually.
                        </p>
                    </div>

                    {/* Preview Area */}
                    <div className="w-full md:w-2/3 border shadow-sm bg-gray-100 p-4 overflow-auto flex justify-center">
                        <div className="scale-[0.6] origin-top md:scale-[0.7] transform-gpu bg-white shadow-lg min-w-[700px] min-h-[800px]" ref={reportRef}>
                            {type === 'receipt' ? <ReceiptTemplate /> : <VacateTemplate />}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ReceiptGenerator;
