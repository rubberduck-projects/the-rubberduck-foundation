import { Box } from "@mui/material";
import OpenInNewRounded from "@mui/icons-material/OpenInNewRounded";
import type { Resource } from "@/content/trails";

const srOnly = { position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" } as const;

export default function ResourceList({ items }: { items: Resource[] }) {
    return (
        <Box component="ul" sx={{ m: 0, pl: 3, display: "grid", gap: 1, lineHeight: 1.6 }}>
            {items.map((r) => (
                <li key={r.title}>
                    {r.href ? (
                        <Box
                            component="a"
                            href={r.href}
                            target="_blank"
                            rel="noreferrer"
                            sx={{
                                color: "primary.main",
                                fontWeight: 600,
                                textUnderlineOffset: 3,
                                "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
                            }}
                        >
                            {r.title}
                            <OpenInNewRounded aria-hidden sx={{ fontSize: "0.875em", ml: 0.375, verticalAlign: "-0.1em" }} />
                            <Box component="span" sx={srOnly}>(opens in a new tab)</Box>
                        </Box>
                    ) : (
                        <Box component="span" sx={{ fontWeight: 600 }}>{r.title}</Box>
                    )}{" "}
                    <Box component="span" sx={{ color: "text.secondary" }}>{r.note}</Box>
                </li>
            ))}
        </Box>
    );
}
