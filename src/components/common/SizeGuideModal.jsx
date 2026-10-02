import React, { useState } from 'react';
import { Modal } from './Modal';

export const SizeGuideModal = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState('inches'); // 'inches' | 'cm'

  const sizeChart = [
    { size: '38 (S)', chestIn: '38', chestCm: '96.5', shoulderIn: '17.5', shoulderCm: '44.5', lengthIn: '40', lengthCm: '101.5', waistIn: '32-34', waistCm: '81-86' },
    { size: '40 (M)', chestIn: '40', chestCm: '101.5', shoulderIn: '18.0', shoulderCm: '45.7', lengthIn: '41', lengthCm: '104.1', waistIn: '34-36', waistCm: '86-91' },
    { size: '42 (L)', chestIn: '42', chestCm: '106.7', shoulderIn: '18.5', shoulderCm: '47.0', lengthIn: '42', lengthCm: '106.7', waistIn: '36-38', waistCm: '91-96' },
    { size: '44 (XL)', chestIn: '44', chestCm: '111.8', shoulderIn: '19.0', shoulderCm: '48.3', lengthIn: '42.5', lengthCm: '108.0', waistIn: '38-40', waistCm: '96-101' },
    { size: '46 (XXL)', chestIn: '46', chestCm: '116.8', shoulderIn: '19.5', shoulderCm: '49.5', lengthIn: '43', lengthCm: '109.2', waistIn: '40-42', waistCm: '101-106' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="L-KUSH Couture Sizing Guide"
      subtitle="Master tailoring specifications for Indian silhouettes"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <p className="text-xs text-neutral-500">
            For bespoke made-to-measure tailoring, mention your measurements during WhatsApp checkout.
          </p>
          <div className="inline-flex border border-neutral-300 p-0.5 bg-neutral-100 shrink-0">
            <button
              onClick={() => setUnit('inches')}
              className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${unit === 'inches' ? 'bg-luxury-black text-white' : 'text-neutral-600'}`}
            >
              Inches
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${unit === 'cm' ? 'bg-luxury-black text-white' : 'text-neutral-600'}`}
            >
              CM
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-luxury-gold-500/40 bg-luxury-cream-50 text-luxury-gold-900 uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3 px-3">Size Tag</th>
                <th className="py-3 px-3">Chest</th>
                <th className="py-3 px-3">Shoulder</th>
                <th className="py-3 px-3">Garment Length</th>
                <th className="py-3 px-3">Waist (Pants)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {sizeChart.map((row) => (
                <tr key={row.size} className="hover:bg-luxury-cream-50/50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-neutral-900">{row.size}</td>
                  <td className="py-3 px-3 text-neutral-600">{unit === 'inches' ? `${row.chestIn}"` : `${row.chestCm} cm`}</td>
                  <td className="py-3 px-3 text-neutral-600">{unit === 'inches' ? `${row.shoulderIn}"` : `${row.shoulderCm} cm`}</td>
                  <td className="py-3 px-3 text-neutral-600">{unit === 'inches' ? `${row.lengthIn}"` : `${row.lengthCm} cm`}</td>
                  <td className="py-3 px-3 text-neutral-600">{unit === 'inches' ? `${row.waistIn}"` : `${row.waistCm} cm`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-luxury-cream-100/70 p-4 border border-luxury-gold-300/40 text-xs text-neutral-700 leading-relaxed">
          <span className="font-semibold text-neutral-900 block mb-1">Tailor's Note:</span>
          Sherwanis and Bandhgalas are structured with shoulder pads and chest canvas for an authoritative posture. If you prefer a relaxed layering fit over a kurta, we recommend ordering one size up.
        </div>
      </div>
    </Modal>
  );
};
