-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 06 oct. 2025 à 23:36
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `gestion_universitaire`
--

-- --------------------------------------------------------

--
-- Structure de la table `absence`
--

CREATE TABLE `absence` (
  `id` int(11) NOT NULL,
  `id_etudiant` int(11) DEFAULT NULL,
  `id_emploi` int(11) DEFAULT NULL,
  `motif` text DEFAULT NULL,
  `statut` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `absence`
--

INSERT INTO `absence` (`id`, `id_etudiant`, `id_emploi`, `motif`, `statut`) VALUES
(1, 1, 1, 'Maladie', 'Justifiée'),
(2, 2, 1, 'Retard', 'Non justifiée');

-- --------------------------------------------------------

--
-- Structure de la table `departement`
--

CREATE TABLE `departement` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `departement`
--

INSERT INTO `departement` (`id`, `nom`) VALUES
(1, 'Informatique'),
(2, 'Mathématiques'),
(3, 'Physique');

-- --------------------------------------------------------

--
-- Structure de la table `emploitemps`
--

CREATE TABLE `emploitemps` (
  `id` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `heure_debut` time DEFAULT NULL,
  `heure_fin` time DEFAULT NULL,
  `id_salle` int(11) DEFAULT NULL,
  `id_matiere` int(11) DEFAULT NULL,
  `id_groupe` int(11) DEFAULT NULL,
  `id_enseignant` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `emploitemps`
--

INSERT INTO `emploitemps` (`id`, `date`, `heure_debut`, `heure_fin`, `id_salle`, `id_matiere`, `id_groupe`, `id_enseignant`) VALUES
(1, '2025-10-06', '08:00:00', '10:00:00', 1, 1, 1, 1),
(2, '2025-10-06', '10:00:00', '12:00:00', 2, 2, 2, 1);

-- --------------------------------------------------------

--
-- Structure de la table `enseignant`
--

CREATE TABLE `enseignant` (
  `id` int(11) NOT NULL,
  `nom` varchar(50) DEFAULT NULL,
  `prenom` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `id_departement` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `enseignant`
--

INSERT INTO `enseignant` (`id`, `nom`, `prenom`, `email`, `id_departement`) VALUES
(1, 'Haddad', 'Imen', 'imen.haddad@univ.tn', 1),
(2, 'Dridi', 'Ali', 'ali.dridi@univ.tn', 2);

-- --------------------------------------------------------

--
-- Structure de la table `etudiant`
--

CREATE TABLE `etudiant` (
  `id` int(11) NOT NULL,
  `nom` varchar(50) DEFAULT NULL,
  `prenom` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `id_groupe` int(11) DEFAULT NULL,
  `id_specialite` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `etudiant`
--

INSERT INTO `etudiant` (`id`, `nom`, `prenom`, `email`, `id_groupe`, `id_specialite`) VALUES
(1, 'Saidi', 'Rania', 'rania.saidi@univ.tn', 1, 1),
(2, 'Mansour', 'Khaled', 'khaled.mansour@univ.tn', 1, 1),
(3, 'Cherif', 'Amine', 'amine.cherif@univ.tn', 2, 2);

-- --------------------------------------------------------

--
-- Structure de la table `evenement`
--

CREATE TABLE `evenement` (
  `id` int(11) NOT NULL,
  `titre` varchar(100) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `evenement`
--

INSERT INTO `evenement` (`id`, `titre`, `type`, `date`, `description`) VALUES
(1, 'Journée Portes Ouvertes', 'Institutionnel', '2025-11-01', 'Présentation des spécialités de l’université'),
(2, 'Hackathon 2025', 'Compétition', '2025-12-05', 'Concours de programmation pour les étudiants');

-- --------------------------------------------------------

--
-- Structure de la table `groupe`
--

CREATE TABLE `groupe` (
  `id` int(11) NOT NULL,
  `nom` varchar(50) DEFAULT NULL,
  `id_niveau` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `groupe`
--

INSERT INTO `groupe` (`id`, `nom`, `id_niveau`) VALUES
(1, 'GL1-A', 1),
(2, 'GL2-B', 2);

-- --------------------------------------------------------

--
-- Structure de la table `matiere`
--

CREATE TABLE `matiere` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `id_niveau` int(11) DEFAULT NULL,
  `id_enseignant` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `matiere`
--

INSERT INTO `matiere` (`id`, `nom`, `id_niveau`, `id_enseignant`) VALUES
(1, 'Programmation Python', 1, 1),
(2, 'Base de Données', 2, 1),
(3, 'Analyse Mathématique', 3, 2);

-- --------------------------------------------------------

--
-- Structure de la table `message`
--

CREATE TABLE `message` (
  `id` int(11) NOT NULL,
  `id_expediteur` int(11) DEFAULT NULL,
  `id_destinataire` int(11) DEFAULT NULL,
  `contenu` text DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `message`
--

INSERT INTO `message` (`id`, `id_expediteur`, `id_destinataire`, `contenu`, `date`) VALUES
(1, 1, 2, 'Bonjour Mme Mouna, veuillez valider les notes du semestre.', '2025-10-06 21:31:24'),
(2, 2, 1, 'Bonjour, c’est fait ! Merci.', '2025-10-06 21:31:24');

-- --------------------------------------------------------

--
-- Structure de la table `niveau`
--

CREATE TABLE `niveau` (
  `id` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `id_specialite` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `niveau`
--

INSERT INTO `niveau` (`id`, `nom`, `id_specialite`) VALUES
(1, '1ère année', 1),
(2, '2ème année', 1),
(3, '3ème année', 2);

-- --------------------------------------------------------

--
-- Structure de la table `salle`
--

CREATE TABLE `salle` (
  `id` int(11) NOT NULL,
  `code` varchar(20) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `capacite` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `salle`
--

INSERT INTO `salle` (`id`, `code`, `type`, `capacite`) VALUES
(1, 'B101', 'Salle de cours', 30),
(2, 'LAB1', 'Laboratoire', 25);

-- --------------------------------------------------------

--
-- Structure de la table `specialite`
--

CREATE TABLE `specialite` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `id_departement` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `specialite`
--

INSERT INTO `specialite` (`id`, `nom`, `id_departement`) VALUES
(1, 'Génie Logiciel', 1),
(2, 'Réseaux', 1),
(3, 'Maths Appliquées', 2);

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `id` int(11) NOT NULL,
  `nom` varchar(50) DEFAULT NULL,
  `prenom` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` varchar(30) DEFAULT NULL,
  `login` varchar(50) DEFAULT NULL,
  `mdp_hash` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `nom`, `prenom`, `email`, `role`, `login`, `mdp_hash`) VALUES
(1, 'Admin', 'Systeme', 'admin@univ.tn', 'administrateur', 'admin', 'hash_admin'),
(2, 'Ben Ali', 'Mouna', 'mouna@univ.tn', 'enseignant', 'mouna', 'hash_mouna'),
(3, 'Trabelsi', 'Sami', 'sami@univ.tn', 'etudiant', 'sami', 'hash_sami');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `absence`
--
ALTER TABLE `absence`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_etudiant` (`id_etudiant`),
  ADD KEY `id_emploi` (`id_emploi`);

--
-- Index pour la table `departement`
--
ALTER TABLE `departement`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `emploitemps`
--
ALTER TABLE `emploitemps`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_salle` (`id_salle`),
  ADD KEY `id_matiere` (`id_matiere`),
  ADD KEY `id_groupe` (`id_groupe`),
  ADD KEY `id_enseignant` (`id_enseignant`);

--
-- Index pour la table `enseignant`
--
ALTER TABLE `enseignant`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `id_departement` (`id_departement`);

--
-- Index pour la table `etudiant`
--
ALTER TABLE `etudiant`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `id_groupe` (`id_groupe`),
  ADD KEY `id_specialite` (`id_specialite`);

--
-- Index pour la table `evenement`
--
ALTER TABLE `evenement`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `groupe`
--
ALTER TABLE `groupe`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_niveau` (`id_niveau`);

--
-- Index pour la table `matiere`
--
ALTER TABLE `matiere`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_niveau` (`id_niveau`),
  ADD KEY `id_enseignant` (`id_enseignant`);

--
-- Index pour la table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_expediteur` (`id_expediteur`),
  ADD KEY `id_destinataire` (`id_destinataire`);

--
-- Index pour la table `niveau`
--
ALTER TABLE `niveau`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_specialite` (`id_specialite`);

--
-- Index pour la table `salle`
--
ALTER TABLE `salle`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `specialite`
--
ALTER TABLE `specialite`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_departement` (`id_departement`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `login` (`login`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `absence`
--
ALTER TABLE `absence`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `departement`
--
ALTER TABLE `departement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `emploitemps`
--
ALTER TABLE `emploitemps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `enseignant`
--
ALTER TABLE `enseignant`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `etudiant`
--
ALTER TABLE `etudiant`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `evenement`
--
ALTER TABLE `evenement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `groupe`
--
ALTER TABLE `groupe`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `matiere`
--
ALTER TABLE `matiere`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `message`
--
ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `niveau`
--
ALTER TABLE `niveau`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `salle`
--
ALTER TABLE `salle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `specialite`
--
ALTER TABLE `specialite`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `absence`
--
ALTER TABLE `absence`
  ADD CONSTRAINT `absence_ibfk_1` FOREIGN KEY (`id_etudiant`) REFERENCES `etudiant` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `absence_ibfk_2` FOREIGN KEY (`id_emploi`) REFERENCES `emploitemps` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `emploitemps`
--
ALTER TABLE `emploitemps`
  ADD CONSTRAINT `emploitemps_ibfk_1` FOREIGN KEY (`id_salle`) REFERENCES `salle` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `emploitemps_ibfk_2` FOREIGN KEY (`id_matiere`) REFERENCES `matiere` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `emploitemps_ibfk_3` FOREIGN KEY (`id_groupe`) REFERENCES `groupe` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `emploitemps_ibfk_4` FOREIGN KEY (`id_enseignant`) REFERENCES `enseignant` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `enseignant`
--
ALTER TABLE `enseignant`
  ADD CONSTRAINT `enseignant_ibfk_1` FOREIGN KEY (`id_departement`) REFERENCES `departement` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `etudiant`
--
ALTER TABLE `etudiant`
  ADD CONSTRAINT `etudiant_ibfk_1` FOREIGN KEY (`id_groupe`) REFERENCES `groupe` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `etudiant_ibfk_2` FOREIGN KEY (`id_specialite`) REFERENCES `specialite` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `groupe`
--
ALTER TABLE `groupe`
  ADD CONSTRAINT `groupe_ibfk_1` FOREIGN KEY (`id_niveau`) REFERENCES `niveau` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `matiere`
--
ALTER TABLE `matiere`
  ADD CONSTRAINT `matiere_ibfk_1` FOREIGN KEY (`id_niveau`) REFERENCES `niveau` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `matiere_ibfk_2` FOREIGN KEY (`id_enseignant`) REFERENCES `enseignant` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `message_ibfk_1` FOREIGN KEY (`id_expediteur`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `message_ibfk_2` FOREIGN KEY (`id_destinataire`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `niveau`
--
ALTER TABLE `niveau`
  ADD CONSTRAINT `niveau_ibfk_1` FOREIGN KEY (`id_specialite`) REFERENCES `specialite` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `specialite`
--
ALTER TABLE `specialite`
  ADD CONSTRAINT `specialite_ibfk_1` FOREIGN KEY (`id_departement`) REFERENCES `departement` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
