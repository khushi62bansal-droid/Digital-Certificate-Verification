
document.addEventListener("DOMContentLoaded", () => {

    // Issue Certificate
    const issueForm = document.getElementById("issueForm");

    issueForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        try {
            showMessage("issueMessage", "Connecting to MetaMask...");

            const { account, contract } = await connectWallet();

            const adminAddress = await contract.admin();

            if (account.toLowerCase() !== adminAddress.toLowerCase()) {
                throw new Error("Only the administrator can issue certificates.");
            }

            const certificateId =
                document.getElementById("certificateId").value.trim();

            const file =
                document.getElementById("certificateFile").files[0];

            if (!file || file.type !== "application/pdf") {
                throw new Error("Please select a valid PDF file.");
            }

            showMessage("issueMessage", "Calculating certificate hash...");

            const hash = await calculateFileHash(file);

            showMessage("issueMessage", "Please confirm the transaction in MetaMask...");

            const tx = await contract.issueCertificate(hash, certificateId);

            showMessage("issueMessage", "Transaction submitted. Waiting for confirmation...");

            await tx.wait();

            showMessage(
                "issueMessage",
                "Certificate issued successfully! Hash: " + hash,
                true
            );

            issueForm.reset();

        } catch (error) {
            console.error(error);
            showMessage(
                "issueMessage",
                error.reason || error.message || "Certificate issuance failed."
            );
        }
    });


    // Revoke Certificate
    const revokeForm = document.getElementById("revokeForm");

    revokeForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        try {
            showMessage("revokeMessage", "Connecting to MetaMask...");

            const { account, contract } = await connectWallet();

            const adminAddress = await contract.admin();

            if (account.toLowerCase() !== adminAddress.toLowerCase()) {
                throw new Error("Only the administrator can revoke certificates.");
            }

            const hash =
                document.getElementById("revokeHash").value.trim();

            if (!/^0x[a-fA-F0-9]{64}$/.test(hash)) {
                throw new Error("Please enter a valid 32-byte certificate hash.");
            }

            showMessage("revokeMessage", "Please confirm the transaction in MetaMask...");

            const tx = await contract.revokeCertificate(hash);

            showMessage("revokeMessage", "Waiting for transaction confirmation...");

            await tx.wait();

            showMessage(
                "revokeMessage",
                "Certificate revoked successfully!",
                true
            );

            revokeForm.reset();

        } catch (error) {
            console.error(error);
            showMessage(
                "revokeMessage",
                error.reason || error.message || "Certificate revocation failed."
            );
        }
    });

});
