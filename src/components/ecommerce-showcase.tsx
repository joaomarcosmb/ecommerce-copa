import { ContentSections } from "@/components/ecommerce-showcase/content-sections";
import { ShowcaseFooter } from "@/components/ecommerce-showcase/footer";
import { ShowcaseHeader } from "@/components/ecommerce-showcase/header";
import { ShowcaseHero } from "@/components/ecommerce-showcase/hero";
import { InfoCarousel } from "@/components/ecommerce-showcase/info-carousel";
import { ProductsSection } from "@/components/ecommerce-showcase/products";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function EcommerceShowcase() {
  return (
    <div className="min-h-screen bg-slate-50">
      <ShowcaseHeader />
      <InfoCarousel />
      <main>
        <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Ecommerce</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Showcase</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </section>
        <ShowcaseHero />
        <ContentSections />
        <ProductsSection />
      </main>
      <ShowcaseFooter />
    </div>
  );
}
