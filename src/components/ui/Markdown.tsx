import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Box } from "@mui/material";
import { palette } from "@/theme/tokens";

export default function Markdown({ children }: { children: string }) {
    return (
        <Box
            sx={{
                lineHeight: 1.7,
                "& h2": { fontSize: "1.5rem", fontWeight: 640, letterSpacing: "-0.02em", mt: 5, mb: 1.5 },
                "& h3": { fontSize: "1.25rem", fontWeight: 640, mt: 4, mb: 1 },
                "& p, & ul, & ol, & blockquote, & table": { mt: 0, mb: 2 },
                "& ul, & ol": { pl: 3 },
                "& a": { color: "primary.main" },
                "& :not(pre) > code": {
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.875em",
                    bgcolor: "action.hover",
                    px: 0.5,
                    borderRadius: "4px",
                },
                "& pre": {
                    m: 0,
                    mb: 2,
                    p: 2,
                    overflowX: "auto",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.875rem",
                    lineHeight: 1.6,
                    bgcolor: "action.hover",
                    border: "1px solid",
                    borderColor: "divider",
                    borderLeft: `3px solid ${palette.duck[400]}`,
                    borderRadius: "8px",
                },
                "& blockquote": { m: 0, mb: 2, pl: 2, borderLeft: "3px solid", borderColor: "divider", color: "text.secondary" },
                "& table": { borderCollapse: "collapse", display: "block", overflowX: "auto" },
                "& th, & td": { border: "1px solid", borderColor: "divider", px: 1.5, py: 0.75, textAlign: "left" },
            }}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{ pre: (props) => <pre tabIndex={0} ref={props.ref} className={props.className}>{props.children}</pre> }}
            >
                {children}
            </ReactMarkdown>
        </Box>
    );
}
