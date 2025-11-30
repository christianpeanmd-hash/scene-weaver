import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { useSubscription } from "./useSubscription";
import { supabase } from "@/integrations/supabase/client";

export interface Team {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: "owner" | "admin" | "member";
  invitedEmail?: string;
  joinedAt?: string;
  createdAt: string;
}

export function useTeam() {
  const { user } = useAuth();
  const { tier } = useSubscription();
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isStudioTier = tier === "studio";
  const maxMembers = 5; // Studio tier allows up to 5 team members

  useEffect(() => {
    async function loadTeam() {
      if (!user || !isStudioTier) {
        setTeam(null);
        setMembers([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // Check if user owns a team
      const { data: ownedTeam } = await supabase
        .from("teams")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (ownedTeam) {
        setTeam({
          id: ownedTeam.id,
          name: ownedTeam.name,
          ownerId: ownedTeam.owner_id,
          createdAt: ownedTeam.created_at,
        });

        // Load team members
        const { data: teamMembers } = await supabase
          .from("team_members")
          .select("*")
          .eq("team_id", ownedTeam.id);

        if (teamMembers) {
          setMembers(teamMembers.map((m: any) => ({
            id: m.id,
            teamId: m.team_id,
            userId: m.user_id,
            role: m.role,
            invitedEmail: m.invited_email,
            joinedAt: m.joined_at,
            createdAt: m.created_at,
          })));
        }
      } else {
        // Check if user is a member of any team
        const { data: membership } = await supabase
          .from("team_members")
          .select("team_id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (membership) {
          const { data: memberTeam } = await supabase
            .from("teams")
            .select("*")
            .eq("id", membership.team_id)
            .single();

          if (memberTeam) {
            setTeam({
              id: memberTeam.id,
              name: memberTeam.name,
              ownerId: memberTeam.owner_id,
              createdAt: memberTeam.created_at,
            });

            const { data: teamMembers } = await supabase
              .from("team_members")
              .select("*")
              .eq("team_id", memberTeam.id);

            if (teamMembers) {
              setMembers(teamMembers.map((m: any) => ({
                id: m.id,
                teamId: m.team_id,
                userId: m.user_id,
                role: m.role,
                invitedEmail: m.invited_email,
                joinedAt: m.joined_at,
                createdAt: m.created_at,
              })));
            }
          }
        }
      }

      setIsLoading(false);
    }

    loadTeam();
  }, [user, isStudioTier]);

  const createTeam = useCallback(async (name: string) => {
    if (!user || !isStudioTier) return null;

    const { data, error } = await supabase
      .from("teams")
      .insert({
        name,
        owner_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create team:", error);
      return null;
    }

    // Add owner as a team member
    await supabase.from("team_members").insert({
      team_id: data.id,
      user_id: user.id,
      role: "owner" as const,
      joined_at: new Date().toISOString(),
    });

    const newTeam: Team = {
      id: data.id,
      name: data.name,
      ownerId: data.owner_id,
      createdAt: data.created_at,
    };

    setTeam(newTeam);
    setMembers([{
      id: "owner",
      teamId: data.id,
      userId: user.id,
      role: "owner" as const,
      joinedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }]);

    return newTeam;
  }, [user, isStudioTier]);

  const inviteMember = useCallback(async (email: string) => {
    if (!user || !team || !isStudioTier) return null;
    if (members.length >= maxMembers) return null;
    if (team.ownerId !== user.id) return null; // Only owner can invite

    const { data, error } = await supabase
      .from("team_members")
      .insert({
        team_id: team.id,
        user_id: user.id, // Temporarily set to inviter, will be updated when user accepts
        role: "member",
        invited_email: email,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to invite member:", error);
      return null;
    }

    const newMember: TeamMember = {
      id: data.id,
      teamId: data.team_id,
      userId: data.user_id,
      role: data.role as "owner" | "admin" | "member",
      invitedEmail: email,
      createdAt: data.created_at,
    };

    setMembers(prev => [...prev, newMember]);
    return newMember;
  }, [user, team, members, maxMembers, isStudioTier]);

  const removeMember = useCallback(async (memberId: string) => {
    if (!user || !team) return false;
    if (team.ownerId !== user.id) return false; // Only owner can remove

    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", memberId);

    if (error) {
      console.error("Failed to remove member:", error);
      return false;
    }

    setMembers(prev => prev.filter(m => m.id !== memberId));
    return true;
  }, [user, team]);

  const updateTeamName = useCallback(async (name: string) => {
    if (!user || !team) return false;
    if (team.ownerId !== user.id) return false;

    const { error } = await supabase
      .from("teams")
      .update({ name })
      .eq("id", team.id);

    if (error) {
      console.error("Failed to update team:", error);
      return false;
    }

    setTeam(prev => prev ? { ...prev, name } : null);
    return true;
  }, [user, team]);

  const isOwner = user && team && team.ownerId === user.id;
  const canInvite = isOwner && members.length < maxMembers;

  return {
    team,
    members,
    isLoading,
    isStudioTier,
    isOwner,
    canInvite,
    maxMembers,
    createTeam,
    inviteMember,
    removeMember,
    updateTeamName,
  };
}
