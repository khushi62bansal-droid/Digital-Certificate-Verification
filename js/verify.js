
document.addEventListener("DOMContentLoaded", () => {

    const verifyForm = document.getElementById("verifyForm");

    verifyForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        try {
            showMessage(
                "verificationResult",
                "Reading certificate PDF..."
            );

            const file = document.getElementById("verificationFile").files[0];

            if (!file || file.type !== "application/pdf") {
                throw new Error("Please upload a valid PDF file.");
            }

            // Calculate SHA-256 hash
            const hash = await calculateFileHash(file);

            showMessage(
                "verificationResult",
                "Checking certificate on blockchain..."
            );

            // Connect to MetaMask and smart contract
            const { contract } = await connectReadOnly();

            const result = await contract.verifyCertificate(hash);

            if (!result.exists) {
                showMessage(
                    "verificationResult",
                    "Certificate NOT FOUND. This certificate is not registered."
                );
                return;
            }

            if (result.revoked) {
                showMessage(
                    "verificationResult",
                    "CERTIFICATE REVOKED. This certificate is no longer valid."
                );
                return;
            }

            const issueDate = new Date(
                Number(result.issueDate) * 1000
            ).toLocaleString();

            const output = document.getElementById("verificationResult");

            output.innerHTML = `
                <h3 style="color:#15803d;">✓ Certificate Verified!</h3>
                <p><strong>Status:</strong> Valid</p>
                <p><strong>Certificate ID:</strong> ${escapeHTML(result.certificateId)}</p>
                <p><strong>Issuer:</strong> ${escapeHTML(result.issuer)}</p>
                <p><strong>Issue Date:</strong> ${escapeHTML(issueDate)}</p>
                <p><strong>SHA-256 Hash:</strong> ${escapeHTML(hash)}</p>
            `;

            output.style.color = "#15803d";

        } catch (error) {
            console.error(error);

            showMessage(
                "verificationResult",
                error.reason || error.message || "Verification failed."
            );
        }
    });

});

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}
