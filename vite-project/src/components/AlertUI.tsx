import Alert from "@mui/material/Alert";

interface AlertConfig {
    description: string;
    variant?: "filled" | "outlined" | "standard";
    severity?: "error" | "info" | "success" | "warning";
}

export default function AlertUI(config: AlertConfig) {
    return (
        <Alert
            variant={config.variant ?? "standard"}
            severity={config.severity ?? "success"}
            sx={{
        width: "250px",      // ancho fijo o por props
        whiteSpace: "normal",                // permite saltos de línea
        wordWrap: "break-word",              // fuerza quiebre si hay palabras largas
      }}>
                {config.description}
            </Alert>
        );
}