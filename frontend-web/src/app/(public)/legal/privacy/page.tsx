export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 font-sans leading-relaxed">
      <h1 className="font-heading font-black text-4xl uppercase tracking-tighter mb-4 text-black dark:text-white">Privacy Policy</h1>
      <p className="text-muted-foreground text-xs uppercase tracking-[0.3em] font-bold mb-12">HEDS Academy Compliance • Last Updated: March 2026</p>
      
      <div className="space-y-12">
        <section>
          <h2 className="text-xl font-black uppercase tracking-widest mb-4 border-l-4 border-brand-yellow pl-4">1. Data Protection Compliance</h2>
          <p className="text-foreground/80">
            HEDS Academy is committed to protecting your personal data in accordance with the <strong>Egyptian Data Protection Law (Law No. 151 of 2020)</strong>. 
            This policy outlines how we collect, process, and safeguard your information within the Arab Republic of Egypt.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black uppercase tracking-widest mb-4 border-l-4 border-brand-yellow pl-4">2. Information Collection</h2>
          <p className="text-foreground/80 mb-4">We collect information necessary for academic excellence and platform security:</p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/70">
            <li>Identity Data: Full name, National ID (where applicable), and profile photos.</li>
            <li>Contact Data: Email address and primary mobile number.</li>
            <li>Academic Data: Course progress, assessment scores, and certificates.</li>
            <li>Financial Data: Payment records processed through secure Egyptian payment gateways.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black uppercase tracking-widest mb-4 border-l-4 border-brand-yellow pl-4">3. Purpose of Processing</h2>
          <p className="text-foreground/80">
            Your data is processed strictly for:
            - Providing educational services and course certificates.
            - Communicating course updates and administrative alerts.
            - Ensuring compliance with local academic and financial regulations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black uppercase tracking-widest mb-4 border-l-4 border-brand-yellow pl-4">4. Data Subject Rights</h2>
          <p className="text-foreground/80">
            Under Law 151/2020, you have the right to access, rectify, or request deletion of your personal data. 
            You may also object to processing for direct marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black uppercase tracking-widest mb-4 border-l-4 border-brand-yellow pl-4">5. Contact Information</h2>
          <p className="text-foreground/80">
            For any inquiries regarding your data privacy, please contact our Data Protection Officer at:
            <br />
            <strong>compliance@hedsacademy.com</strong>
          </p>
        </section>
      </div>

      <div className="mt-20 pt-8 border-t border-black/5 flex justify-between items-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">© 2026 HEDS ACADEMY • REGULATED IN EGYPT</p>
        <div className="h-8 w-8 bg-black/5 rounded-lg" />
      </div>
    </div>
  )
}
