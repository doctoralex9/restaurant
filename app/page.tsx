import HeroSection from './sections/HeroSection'
import MenuCTASection from './sections/MenuCTASection'
import FooterSection from './sections/FooterSection'

export default function Page() {
  return (
    <main className="bg-background overflow-x-hidden">
      <HeroSection />
      <MenuCTASection />
      <FooterSection />
    </main>
  )
}
