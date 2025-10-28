import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Shield, 
  Clock, 
  Star, 
  Users, 
  CheckCircle,
  ArrowRight,
  Building2,
  Sparkle
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50" style={{background: 'linear-gradient(to bottom right, #f8fafc, #dbeafe, #ccfbf1)'}}>
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 text-sm">
              <Sparkle className="w-4 h-4 mr-2" />
              Professional Cleaning Marketplace
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Connect with
              <span className="text-primary" style={{color: '#0d9488'}}> Professional Cleaners</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The marketplace where businesses find trusted cleaning professionals. 
              Post jobs, receive bids, and get your space cleaned by verified experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg"  className="text-lg px-8 py-6" style={{backgroundColor: '#0d9488', color: 'white'}}>
                <Link href="/company/post-job">
                  Post a Job
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline"  className="text-lg px-8 py-6">
                <Link href="/janitor/marketplace">
                  Find Work
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose The Link Pro?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make finding and hiring professional cleaners simple, secure, and efficient.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg bg-background/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Verified Professionals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All cleaners are background-checked, insured, and rated by previous clients. 
                  Your safety and satisfaction are guaranteed.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg bg-background/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Quick & Easy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Post your job in minutes, receive competitive bids, and choose the best cleaner. 
                  Simple process, professional results.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg bg-background/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Quality Guaranteed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  100% satisfaction guarantee. If you're not happy with the work, 
                  we'll make it right or refund your money.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Simple steps to get your cleaning done
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Post Your Job</h3>
              <p className="text-muted-foreground">
                Describe your cleaning needs, location, and budget. 
                Set your preferred timeline and let professionals bid.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Receive Bids</h3>
              <p className="text-muted-foreground">
                Professional cleaners submit competitive bids with their rates, 
                availability, and approach to your job.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Choose & Pay</h3>
              <p className="text-muted-foreground">
                Select the best bid, pay securely through our platform, 
                and get your cleaning done by verified professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Jobs Completed</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">150+</div>
              <div className="text-muted-foreground">Verified Cleaners</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-muted-foreground">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of businesses and cleaners who trust The Link Pro 
              for their cleaning needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg"  className="text-lg px-8 py-6">
                <Link href="/company/post-job">
                  <Building2 className="mr-2 w-5 h-5" />
                  Post Your First Job
                </Link>
              </Button>
              <Button size="lg" variant="outline"  className="text-lg px-8 py-6">
                <Link href="/janitor/marketplace">
                  <Users className="mr-2 w-5 h-5" />
                  Start Earning Today
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">The Link Pro</span>
              </div>
              <p className="text-muted-foreground">
                Connecting businesses with professional cleaners through our trusted marketplace.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Companies</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/company/marketplace" className="hover:text-primary">Post a Job</Link></li>
                <li><Link href="/company/how-it-works" className="hover:text-primary">How It Works</Link></li>
                <li><Link href="/company/pricing" className="hover:text-primary">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Cleaners</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/janitor/marketplace" className="hover:text-primary">Find Work</Link></li>
                <li><Link href="/janitor/signup" className="hover:text-primary">Join as Cleaner</Link></li>
                <li><Link href="/janitor/earnings" className="hover:text-primary">Earnings</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/help" className="hover:text-primary">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 The Link Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
