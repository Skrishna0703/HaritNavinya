import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerStyle = {
    //background: 'linear-gradient(135deg, #5ac48d 0%, #5e8671 50%, #064423 100%)',
  };

  const glassCardStyle = {
    background: 'linear-gradient(135deg, #5ac48d 0%, #5e8671 50%, #064423 100%)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
  };

  return (
    <footer 
      className="w-screen relative right-[50vw] mr-[-50vw] py-12 mt-auto"
      style={footerStyle}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8" style={glassCardStyle}>
          <div className="text-center space-y-3">
            {/* Developer Info */}
            {/* <p style={{ color: '#FFFFFF' }} className="text-lg font-bold">
              Developed by Final Year AI&DS Students
            </p>
            <p style={{ color: '#D1FAE5' }} className="text-base font-semibold">
              Genba Sopanrao Moze College of Engineering
            </p> */}
            
            {/* Copyright and Dataset */}
            <p style={{ color: '#FFFFFF' }} className="text-sm leading-relaxed font-medium pt-5">
              © {currentYear} HaritNavinya. {' '}
               
              <p
                href="https://soilhealth.dac.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#ffffff' }}
                className="font-bold transition-colors duration-300 underline hover:text-green-300"
              >
               Dataset:soilhealth.dac.gov.in
              </p>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
