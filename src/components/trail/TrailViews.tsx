"use client";

import { useState, type ReactNode } from "react";
import { Box, ToggleButton, ToggleButtonGroup, useMediaQuery, useTheme } from "@mui/material";
import AccountTreeOutlined from "@mui/icons-material/AccountTreeOutlined";
import ViewListOutlined from "@mui/icons-material/ViewListOutlined";

type View = "map" | "list";

// Phones get the list until the reader picks a view; CSS decides first so the static HTML is right before hydration.
export function TrailViews({ map, list }: { map: ReactNode; list: ReactNode }) {
    const small = useMediaQuery(useTheme().breakpoints.down("sm"));
    const [choice, setChoice] = useState<View | null>(null);
    const view = choice ?? (small ? "list" : "map");
    const show = (v: View) => (choice ? { display: choice === v ? "block" : "none" } : { display: v === "list" ? { xs: "block", sm: "none" } : { xs: "none", sm: "block" } });

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1.5 }}>
                <ToggleButtonGroup
                    value={view}
                    exclusive
                    size="small"
                    aria-label="Trail view"
                    onChange={(_, v: View | null) => v && setChoice(v)}
                    sx={{ "& .MuiToggleButton-root": { textTransform: "none", gap: 0.75, px: 1.5, py: 0.5, fontSize: "0.8125rem" } }}
                >
                    <ToggleButton value="map">
                        <AccountTreeOutlined sx={{ fontSize: 16 }} />
                        Map
                    </ToggleButton>
                    <ToggleButton value="list">
                        <ViewListOutlined sx={{ fontSize: 16 }} />
                        List
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
            <Box sx={show("map")}>{map}</Box>
            <Box sx={show("list")}>{list}</Box>
        </>
    );
}
