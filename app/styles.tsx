const styles = {
    container: {
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        padding: "2rem",
        backgroundColor: "#fdf6e4", // light tan background
        color: "#333", // dark text
        minHeight: "100vh",
    },
    title: {
        fontSize: "2.5rem",
        color: "#0044cc", // blue title
        marginBottom: "1.5rem",
        fontWeight: "bold",
    },
    fileInput: {
        marginBottom: "1.5rem",
        padding: "0.5rem",
        borderRadius: "5px",
        border: "1px solid #0044cc",
        color: "#0044cc",
        cursor: "pointer",
    },
    previewContainer: {
        display: "flex",
        flexWrap: "wrap" as const,
        gap: "1rem",
        marginBottom: "1.5rem",
    },
    imagePreview: {
        position: "relative" as const,
        width: "100px",
        height: "100px",
        borderRadius: "8px",
        overflow: "hidden",
        border: "2px solid #0044cc",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    previewImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover" as const,
    },
    removeButton: {
        position: "absolute" as const,
        top: "5px",
        right: "5px",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        color: "white",
        border: "none",
        borderRadius: "50%",
        width: "20px",
        height: "20px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
    },
    uploadButton: {
        padding: "0.75rem 1.5rem",
        fontSize: "1rem",
        color: "white",
        backgroundColor: "#0044cc",
        border: "none",
        borderRadius: "8px",
        transition: "background-color 0.3s ease",
    },
    uploadButtonHover: {
        backgroundColor: "#003399", // slightly darker blue for hover
    },
    limitText: {
        color: "#cc0000", // red for limit message
        fontWeight: "bold",
        marginTop: "0.5rem",
    },
    spinner: {
        marginTop: "1rem",
        fontSize: "1rem",
        color: "#0044cc",
    },
};

export default styles;
