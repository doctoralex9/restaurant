import SmoothScrollProvider from './components/SmoothScrollProvider'
import HeroSection from './sections/HeroSection'
import PitogiraSection from './sections/PitogiraSection'
import KalamaSection from './sections/KalamaSection'
import SalatesSection from './sections/SalatesSection'
import MenuCTASection from './sections/MenuCTASection'
import FooterSection from './sections/FooterSection'

export default function Page() {
  return (
    <SmoothScrollProvider>
      <main className="bg-background overflow-x-hidden">
        <HeroSection />
        <PitogiraSection />
        <KalamaSection />
        <SalatesSection />
        <MenuCTASection />
        <FooterSection />
      </main>
    </SmoothScrollProvider>
  )
}
