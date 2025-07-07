import { Request, Response } from "express";
import Utilisateur from "../models/Utilisateur.model";
import Follower from "../models/Follower.model";

interface AuthRequest extends Request {
    user?: { id: number };
}

export async function followUser(req: AuthRequest, res: Response) {
  try {
    const user_id = req.user?.id;
    const abonne_id = parseInt(req.params.abonne_id, 10);

    if (!user_id ) {
      res.status(400).json({ message: "Données manquantes." });
      return
    }

    if (user_id === abonne_id) {
      res.status(400).json({ message: "Vous ne pouvez pas vous abonner à vous-même." });
      return
    }

    const utilisateurExistant = await Utilisateur.findByPk(user_id);
    const isFollower = await Follower.findOne({ where: { user_id, abonne_id } });


    if (!utilisateurExistant) {
      res.status(400).json({ message: "L'utilisateur spécifié n'existe pas." });
      return
    }

    if (isFollower) {
      res.status(400).json({ message: "Déjà abonné" });
      return
    }

    const follow = await Follower.create({ user_id, abonne_id });

    res.status(201).json(follow);
    return

  } catch (err: any) {
    res.status(500).json({ message: 'Erreur interne', error: err.message });
    return
  }
}

export async function isFollowing(req: AuthRequest, res: Response) {
  try {
  const user_id = req.user?.id;
  const abonne_id = parseInt(req.params.abonne_id, 10);

  if (!user_id || !abonne_id) {
    res.status(400).json({ message: 'Paramètres manquants.' });
    return;
  }

  const isFollowing = await Follower.findOne({ where: { user_id, abonne_id } });

  res.status(200).json({ isFollowing: !!isFollowing });
  } catch (err: any) {
    res.status(500).json({ message: 'Erreur interne', error: err.message });
  }
};

export async function unfollowUser(req: AuthRequest, res: Response) {
  try {
    const user_id = req.user?.id;
    const abonne_id = parseInt(req.params.abonne_id, 10);

    if (!user_id) {
      res.status(400).json({ message: "Données manquantes." });
      return
    }

    if (user_id === abonne_id) {
      res.status(400).json({ message: "Vous ne pouvez pas vous désabonner de vous-même." });
      return
    }

    const utilisateurExistant = await Utilisateur.findByPk(user_id);
    const isFollower = await Follower.findOne({ where: { user_id, abonne_id } });
    
    if (!utilisateurExistant) {
      res.status(400).json({ message: "L'utilisateur spécifié n'existe pas." });
      return
    }

    const existingFollow = await Follower.findOne({
      where: { user_id, abonne_id },
    });

    if (!existingFollow) {
      res.status(404).json({ message: "Pas d'abonnement trouvé." });
      return
    }

    await existingFollow.destroy();

    res.status(200).json({ message: "Désabonné avec succès." });
  } catch (err: any) {
    res.status(500).json({ message: 'Erreur interne', error: err.message });
  }
}

export async function getFollowing(req: AuthRequest, res: Response) {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      res.status(400).json({ message: "Données manquantes." });
      return
    }

    const followers = await Follower.findAll({
      where: { user_id },
    });

    res.status(200).json(followers);
  } catch (err: any) {
    res.status(500).json({ message: 'Erreur interne', error: err.message });
  }
}

export async function getFollower(req: AuthRequest, res: Response) {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      res.status(400).json({ message: "Données manquantes." });
      return
    }

    const abonnes = await Follower.findAll({
      where: {abonne_id: user_id},
    });


    res.status(200).json(abonnes);
    return
  } catch (err: any) {
    res.status(500).json({ message: 'Erreur interne', error: err.message });
    return
  }
}
// GET /followers/:id
export async function getFollowersByUserId(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10);

  try {
    const followers = await Follower.findAll({
      where: { abonne_id: id }, // ceux qui suivent "id"
    });

    res.status(200).json(followers);
    return;
  } catch (err: any) {
    res.status(500).json({ message: "Erreur interne", error: err.message });
  }
}

// GET /following/:id
export async function getFollowingByUserId(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10);

  try {
    const following = await Follower.findAll({
      where: { user_id: id }, // ceux que "id" suit
    });

    res.status(200).json(following);
    return
  } catch (err: any) {
    res.status(500).json({ message: "Erreur interne", error: err.message });
  }
}
