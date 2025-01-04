// app/[sessionId]/results/page.tsx

import React from "react";

interface ImageData {
  imageUrl: string;
  imageId: string;
  ranking: number[];
  averageRanking: number;
}

const Results = async ({ params }: { params: { sessionId: string } }) => {
  const sessionId = params.sessionId;
  const endpoint = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    // Fetch data from your endpoint
    const response = await fetch(`${endpoint}/getSessionData?sessionId=${sessionId}`);

    if (!response.ok) {
      throw new Error("Failed to upload images");
    }

    const responseJson = await response.json();

    // Process the response and calculate averageRanking
    const images: ImageData[] = responseJson.map((image: any): ImageData => {
      const rankings = image.ranking;
      const averageRanking =
        rankings.length > 0
          ? rankings.reduce((a: number, b: number) => a + b, 0) / rankings.length
          : Infinity;

      return {
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        ranking: rankings,
        averageRanking,
      };
    });

    // Sort images by averageRanking (ascending)
    const sortedImages = images
      .sort((a, b) => a.averageRanking - b.averageRanking)
      .map(({ averageRanking, ...rest }) => rest);

    return (
      <div style={styles.container}>
        <h1>Results for Session: {sessionId}</h1>
        <div style={styles.imageGrid}>
          {sortedImages.map((image) => (
            <div key={image.imageId} style={styles.imageWrapper}>
              <img src={image.imageUrl} alt={image.imageId} style={styles.image} />
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div>
        <h1>Error: {error instanceof Error ? error.message : "Unknown Error"}</h1>
      </div>
    );
  }
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
    textAlign: "center" as "center", // Explicitly type textAlign
  },
  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
    justifyItems: "center",
    marginTop: "20px",
  },
  imageWrapper: {
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "auto",
    display: "block",
  },
};

export default Results;
