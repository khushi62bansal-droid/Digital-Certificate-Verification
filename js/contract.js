
// Smart Contract Configuration

const CONTRACT_ADDRESS = "0x4929dEC709C0BD2a40AfDBDFB1b8218b870270d0";

const CONTRACT_ABI = [
    "function admin() view returns (address)",

    "function issueCertificate(bytes32 _certificateHash, string _certificateId)",

    "function verifyCertificate(bytes32 _certificateHash) view returns (bool exists, bool valid, string certificateId, address issuer, uint256 issueDate, bool revoked)",

    "function revokeCertificate(bytes32 _certificateHash)",

    "function certificates(bytes32) view returns (string certificateId, address issuer, uint256 issueDate, bool exists, bool revoked)"
];
