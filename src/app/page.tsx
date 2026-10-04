import { Box } from "@mui/material";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import SkipLink from "@/components/ui/SkipLink";

export default function Home() {
    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <SkipLink />
            <SiteHeader />
            <Box component="main" id="main" sx={{ flexGrow: 1 }} />
            <SiteFooter />
        </Box>
    );
}
