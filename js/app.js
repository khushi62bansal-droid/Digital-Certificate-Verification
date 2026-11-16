
// MetaMask and Blockchain Connection

async function connectWallet() {
    if (!window.ethereum) {
        throw new Error("Please install MetaMask first.");
    }

    const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
    });

    const provider = new ethers.BrowserProvider(window.ethereum);

    const network = await provider.getNetwork();

    if (network.chainId !== 1337n) {
        throw new Error("Please connect MetaMask to Ganache Local (Chain ID 1337).");
    }

    const signer = await provider.getSigner();

    const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
    );

    return {
        account: accounts[0],
        provider,
        signer,
        contract
    };
}

// Generate SHA-256 hash of an uploaded PDF

async function calculateFileHash(file) {
    const fileBuffer = await file.arrayBuffer();

    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        fileBuffer
    );

    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return "0x" + hashArray
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

// Display messages on the website

function showMessage(elementId, message, success = false) {
    const element = document.getElementById(elementId);

    if (!element) return;

    element.textContent = message;
    element.style.color = success ? "#15803d" : "#dc2626";
}
