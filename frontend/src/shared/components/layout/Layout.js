import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FloatingCart } from '../cart/FloatingCart';
export const Layout = ({ children }) => {
  return (<div className="min-h-screen flex flex-col bg-background relative selection:bg-primary/30 selection:text-primary-foreground">
    <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10"></div>
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
    <FloatingCart />
  </div>);
};
