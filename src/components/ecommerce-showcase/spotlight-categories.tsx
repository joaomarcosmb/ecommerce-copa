import { H2 } from "../typography";
import { featuredCategories } from "./data";

export function SpotlightCategories() {
  return (
    <section
      aria-labelledby="spotlight-heading"
      className="my-30 flex w-full flex-col items-center justify-center gap-10"
    >
      <H2 id="spotlight-heading" className="font-big-shoulders font-semibold">
        Nossos destaques
      </H2>
      <ul className="flex flex-row items-center justify-center gap-20">
        {featuredCategories.map((cat) => (
          <li key={cat.slug}>
            <a
              href={`/category/${cat.slug}`}
              className="group flex flex-col items-center gap-2"
            >
              <div className="relative h-100 w-75">
                <div className="absolute inset-0 rounded-2xl bg-slate-900 transition-transform duration-300 group-hover:-rotate-6 group-hover:shadow-md" />

                <div className="relative h-full w-full overflow-hidden rounded-2xl transition-transform duration-300 group-hover:rotate-4 group-hover:shadow-lg">
                  <img
                    src={cat.image}
                    alt={`Categoria ${cat.label}`}
                    className="h-full w-full object-cover transition-transform duration-300"
                  />
                </div>
              </div>

              <span className="text-lg">{cat.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
