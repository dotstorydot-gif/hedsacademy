export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 font-sans leading-relaxed">
      <h1 className="font-heading font-black text-4xl uppercase tracking-tighter mb-4 text-black dark:text-white">Terms of Service</h1>
      <p className="text-muted-foreground text-xs uppercase tracking-[0.3em] font-bold mb-12">Academic Agreement • Arab Republic of Egypt</p>
      
      <div className="space-y-12">
        <section>
          <h2 className="text-xl font-black uppercase tracking-widest mb-4 border-l-4 border-brand-yellow pl-4">1. Acceptance of Terms</h2>
          <p className="text-foreground/80">
            By accessing HEDS Academy, you agree to comply with these terms and all applicable laws in Egypt, 
            including the <strong>Egyptian Civil Code</strong> and <strong>Electronic Signature Law (Law No. 15 of 2004)</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black uppercase tracking-widest mb-4 border-l-4 border-brand-yellow pl-4">2. Educational Services</h2>
          <p className="text-foreground/80">
            HEDS Academy provides a digital learning platform. Course content is provided "as is" and completion 
            certificates are recognized within the scope of our private academy accreditation.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black uppercase tracking-widest mb-4 border-l-4 border-brand-yellow pl-4">3. Financial Transactions</h2>
          <p className="text-foreground/80">
            All prices are quoted in Egyptian Pounds (EGP) unless stated otherwise. Refunds are subject to our 
            refund policy and guided by the <strong>Egyptian Consumer Protection Law (Law No. 181 of 2018)</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black uppercase tracking-widest mb-4 border-l-4 border-brand-yellow pl-4">4. Prohibited Conduct</h2>
          <p className="text-foreground/80">
            Users are strictly prohibited from:
            - Recording or redistributing protected course material.
            - Engaging in harassment or inappropriate communication in chat rooms.
            - Attempting to circumvent the platform's security measures.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black uppercase tracking-widest mb-4 border-l-4 border-brand-yellow pl-4">5. Governing Law</h2>
          <p className="text-foreground/80">
            These terms are governed by the laws of the Arab Republic of Egypt. Any disputes shall be 
            exclusively resolved in the courts of Cairo, Egypt.
          </p>
        </section>
      </div>

      <div className="mt-20 pt-8 border-t border-black/5 flex justify-between items-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">© 2026 HEDS ACADEMY • LEGAL DISPATCH</p>
      </div>
    </div>
  )
}
