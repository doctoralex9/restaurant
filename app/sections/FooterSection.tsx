'use client'

export default function FooterSection() {
  return (
    <footer className="relative bg-[#080808] border-t border-white/5 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Amber rule */}
        <div
          className="h-px w-16 mb-10"
          style={{ background: 'linear-gradient(90deg, #f59e0b, #d97706)' }}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <p
              className="text-3xl font-black text-amber-400 mb-2"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              ΣΧΑΡΑ
            </p>
            <p
              className="text-xs tracking-[0.25em] uppercase text-white/30"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Ψητά στα κάρβουνα
            </p>
          </div>

          {/* Address */}
          <div>
            <p
              className="text-[10px] tracking-[0.4em] uppercase text-amber-500/50 mb-3"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Διεύθυνση
            </p>
            <p
              className="text-sm text-white/50 leading-relaxed"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Οδός Κεφαλληνίας 47<br />
              Κυψέλη, Αθήνα 11362<br />
              Ελλάδα
            </p>
          </div>

          {/* Contact */}
          <div>
            <p
              className="text-[10px] tracking-[0.4em] uppercase text-amber-500/50 mb-3"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Επικοινωνία
            </p>
            <p
              className="text-sm text-white/50 leading-relaxed"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              +30 210 883 4720<br />
              sxara@example.gr<br />
              <br />
              Δευ–Κυρ: 12:00–01:00
            </p>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p
            className="text-[10px] tracking-[0.3em] uppercase text-white/20"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            © 1987–{new Date().getFullYear()} ΣΧΑΡΑ. Όλα τα δικαιώματα κατοχυρωμένα.
          </p>
          <p
            className="text-[10px] tracking-[0.3em] uppercase text-white/15"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Athens · Greece
          </p>
        </div>
      </div>
    </footer>
  )
}
