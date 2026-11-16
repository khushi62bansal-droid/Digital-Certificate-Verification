
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificateVerification {

    address public admin;

    struct Certificate {
        string certificateId;
        address issuer;
        uint256 issueDate;
        bool exists;
        bool revoked;
    }

    mapping(bytes32 => Certificate) public certificates;

    event CertificateIssued(
        bytes32 indexed certificateHash,
        string certificateId,
        address issuer
    );

    event CertificateRevoked(bytes32 indexed certificateHash);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function issueCertificate(
        bytes32 _certificateHash,
        string memory _certificateId
    ) public onlyAdmin {
        require(!certificates[_certificateHash].exists, "Certificate already exists");

        certificates[_certificateHash] = Certificate({
            certificateId: _certificateId,
            issuer: msg.sender,
            issueDate: block.timestamp,
            exists: true,
            revoked: false
        });

        emit CertificateIssued(_certificateHash, _certificateId, msg.sender);
    }

    function verifyCertificate(bytes32 _certificateHash)
        public
        view
        returns (
            bool exists,
            bool valid,
            string memory certificateId,
            address issuer,
            uint256 issueDate,
            bool revoked
        )
    {
        Certificate memory cert = certificates[_certificateHash];

        return (
            cert.exists,
            cert.exists && !cert.revoked,
            cert.certificateId,
            cert.issuer,
            cert.issueDate,
            cert.revoked
        );
    }

    function revokeCertificate(bytes32 _certificateHash) public onlyAdmin {
        require(certificates[_certificateHash].exists, "Certificate does not exist");
        require(!certificates[_certificateHash].revoked, "Certificate already revoked");

        certificates[_certificateHash].revoked = true;

        emit CertificateRevoked(_certificateHash);
    }
}
