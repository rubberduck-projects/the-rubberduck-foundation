import { Box } from "@mui/material";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import Breadcrumbs, { type CrumbTitles } from "@/components/layout/Breadcrumbs";
import { allArticles, trails } from "@/content/trails";
import SkipLink from "@/components/ui/SkipLink";

// Only titles cross to the client, so article bodies stay out of the bundle.
const titles: CrumbTitles = Object.fromEntries(
    trails.map((t) => [t.slug, { title: t.title, articles: Object.fromEntries(allArticles(t).map((a) => [a.slug, a.title])) }]),
);

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <SkipLink />
            <SiteHeader />
            <Breadcrumbs titles={titles} />
            <Box component="main" id="main" sx={{ flexGrow: 1 }}>
                {children}
            </Box>
            <SiteFooter />
        </Box>
    );
}
