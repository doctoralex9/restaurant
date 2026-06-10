import HeroSection from './sections/HeroSection'
import VideoScrollSection from './sections/VideoScrollSection'
import MenuCTASection from './sections/MenuCTASection'
import FooterSection from './sections/FooterSection'

export default function Page() {
  return (
    <main className="bg-background overflow-x-hidden">
      <HeroSection />
      <VideoScrollSection />
      <MenuCTASection />
      <FooterSection />
    </main>
  )
}
