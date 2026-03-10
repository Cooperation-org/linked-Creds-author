import { ISkill } from 'hr-context'
import { FormData } from '../../credentialForm/form/types/Types'
export type SkillClaimFormData = {
  personName: string
  personId?: string
  skills: ISkill[]
  evidence?: Array<{ id: string; name: string; type?: string; description?: string }>
}

export function normalizeSkillClaimFormData(formData: FormData): SkillClaimFormData {
  const skill = formData.skills?.[0] // pick the first skill in the array
  const skillName = skill?.name ?? formData.credentialName ?? ''
  const skillDescription = formData.credentialDescription ?? undefined
  const narrative = typeof formData.description === 'string'
    ? formData.description
    : typeof formData.credentialDescription === 'string'
      ? formData.credentialDescription
      : ''

  const skills = [
    {
      name: skillName,
      description: skillDescription,
      durationPerformed: formData.credentialDuration ?? '',
      narrative,
      image: formData.evidenceLink ? { id: formData.evidenceLink, type: 'Image' } : undefined
    }
  ] as ISkill[]

  const evidence = formData.portfolio.length ? formData.portfolio.map((p: any) => ({ id: p.url, name: p.name, description: p.description })) : []
  return {
    personName: formData.fullName ?? '',
    skills,
    evidence: evidence.length ? evidence : []
  }
}
