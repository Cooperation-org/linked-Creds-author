'use client'
import React, { useState } from 'react'
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Link as MuiLink
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddIcon from '@mui/icons-material/Add'
import ImportExportIcon from '@mui/icons-material/ImportExport'
import ViewListIcon from '@mui/icons-material/ViewList'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import EmailIcon from '@mui/icons-material/Email'
import RecommendIcon from '@mui/icons-material/Recommend'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HelpIcon from '@mui/icons-material/Help'
import { useTheme } from '@mui/material/styles'

const HelpPage = () => {
  const theme = useTheme()
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false)

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedAccordion(isExpanded ? panel : false)
    }

  const quickStartSteps = [
    {
      step: 1,
      title: 'Sign In',
      description:
        'Click "Sign In" in the top right corner and authenticate with your Google account.',
      icon: <CheckCircleIcon />
    },
    {
      step: 2,
      title: 'Create Your First Skill',
      description: 'Click "Add a New Skill" to start documenting your first credential.',
      icon: <AddIcon />
    },
    {
      step: 3,
      title: 'Add Evidence',
      description:
        'Upload photos, documents, or links that prove your skills and experiences.',
      icon: <VisibilityIcon />
    },
    {
      step: 4,
      title: 'Request Recommendations',
      description: 'Ask trusted contacts to validate your skills with recommendations.',
      icon: <RecommendIcon />
    },
    {
      step: 5,
      title: 'Share Your Credentials',
      description:
        'Share your verified skills with employers or add them to your LinkedIn profile.',
      icon: <CheckCircleIcon />
    }
  ]

  const features = [
    {
      id: 'create-credential',
      title: 'Creating New Skills & Credentials',
      icon: <AddIcon />,
      content: (
        <Box>
          <Typography variant='h6' gutterBottom>
            How to Create a New Skill Credential
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary="Navigate to 'Add a New Skill'"
                secondary="Click the 'Add a New Skill' button in the navigation menu or on the homepage"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Fill in Basic Information'
                secondary='Enter your full name, skill name, and description of what you can do'
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Add Duration & Criteria'
                secondary="Specify how long you've had this skill and what criteria you meet"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Upload Evidence'
                secondary='Add photos, documents, certificates, or portfolio pieces that prove your skills'
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Choose Storage Option'
                secondary='Select Google Drive to securely store your credential data'
              />
            </ListItem>
          </List>
          <Typography variant='body2' sx={{ mt: 2, fontStyle: 'italic' }}>
            💡 Tip: Be specific about your skills and include concrete examples of your
            work.
          </Typography>
        </Box>
      )
    },
    {
      id: 'import-credential',
      title: 'Importing Existing Credentials',
      icon: <ImportExportIcon />,
      content: (
        <Box>
          <Typography variant='h6' gutterBottom>
            How to Import Credentials from URLs
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary="Navigate to 'Import Skill Credential'"
                secondary="Click 'Import Skill Credential' in the navigation menu"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Enter Credential URL'
                secondary='Paste the URL of your existing credential (must be a valid JSON credential)'
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary="Click 'Import Credential Data'"
                secondary='The system will fetch and parse your credential information'
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Review Pre-filled Form'
                secondary='Check the automatically filled form and make any necessary adjustments'
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Complete the Process'
                secondary='Follow the normal credential creation flow to finalize your import'
              />
            </ListItem>
          </List>
          <Typography variant='body2' sx={{ mt: 2, fontStyle: 'italic' }}>
            💡 Tip: Supported formats include standard verifiable credentials and Google
            Drive links.
          </Typography>
        </Box>
      )
    },
    {
      id: 'view-skills',
      title: 'Managing Your Skills',
      icon: <ViewListIcon />,
      content: (
        <Box>
          <Typography variant='h6' gutterBottom>
            How to View and Manage Your Skills
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary="Access 'My Skills'"
                secondary="Click 'My Skills' in the navigation menu to see all your created credentials"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Browse Your Credentials'
                secondary='View all your skills in a organized list with key information displayed'
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='View Detailed Information'
                secondary='Click on any credential to see comprehensive details, evidence, and recommendations'
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Request Recommendations'
                secondary="Use the 'Ask for Recommendation' feature to get validation from others"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Share Your Skills'
                secondary='Copy shareable links or export your credentials for use in resumes and applications'
              />
            </ListItem>
          </List>
          <Typography variant='body2' sx={{ mt: 2, fontStyle: 'italic' }}>
            💡 Tip: Regularly update your skills with new evidence and recommendations to
            keep them current.
          </Typography>
        </Box>
      )
    },
    {
      id: 'analytics',
      title: 'Understanding Analytics',
      icon: <AnalyticsIcon />,
      content: (
        <Box>
          <Typography variant='h6' gutterBottom>
            How to Use Analytics Dashboard
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Access Analytics'
                secondary="Click 'Analytics' in the navigation menu to view your credential statistics"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='View Key Metrics'
                secondary='See total credentials created, views, shares, and recommendation requests'
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Track Performance'
                secondary='Monitor which skills are most viewed and shared to understand your strengths'
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Identify Opportunities'
                secondary='Use analytics to identify which skills need more evidence or recommendations'
              />
            </ListItem>
          </List>
          <Typography variant='body2' sx={{ mt: 2, fontStyle: 'italic' }}>
            💡 Tip: Check your analytics regularly to track the impact of your
            credentials.
          </Typography>
        </Box>
      )
    },
    {
      id: 'email-verification',
      title: 'Email Verification Process',
      icon: <EmailIcon />,
      content: (
        <Box>
          <Typography variant='h6' gutterBottom>
            How to Verify Your Email Address
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Navigate to Email Verification'
                secondary='Access the email verification page from your credential management flow'
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Enter Your Email'
                secondary='Type the email address you want to verify for your credentials'
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Send Verification Code'
                secondary="Click 'Send Verification Code' to receive a verification code via email"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Enter Verification Code'
                secondary='Check your email and enter the 6-digit verification code'
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Complete Verification'
                secondary="Click 'Verify' to complete the process and receive your email credential"
              />
            </ListItem>
          </List>
          <Typography variant='body2' sx={{ mt: 2, fontStyle: 'italic' }}>
            💡 Tip: Keep your verification code secure and don&apos;t share it with
            others.
          </Typography>
        </Box>
      )
    },
    {
      id: 'recommendations',
      title: 'Requesting & Providing Recommendations',
      icon: <RecommendIcon />,
      content: (
        <Box>
          <Typography variant='h6' gutterBottom>
            How to Use the Recommendation System
          </Typography>

          <Typography variant='subtitle1' sx={{ mt: 2, fontWeight: 'bold' }}>
            Requesting Recommendations:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Select a Credential'
                secondary="Go to 'My Skills' and choose the credential you want recommendations for"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary="Click 'Ask for Recommendation'"
                secondary='Use the recommendation request feature on your credential page'
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Enter Contact Information'
                secondary='Provide the name and email of the person you want to recommend you'
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Send Request'
                secondary='The system will send a personalized recommendation request to your contact'
              />
            </ListItem>
          </List>

          <Typography variant='subtitle1' sx={{ mt: 3, fontWeight: 'bold' }}>
            Providing Recommendations:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Receive Request'
                secondary='Check your email for a recommendation request link'
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Review Credential'
                secondary="View the person's skill credential and evidence before providing feedback"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Fill Recommendation Form'
                secondary='Complete the recommendation form with your honest assessment'
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Submit Recommendation'
                secondary="Submit your recommendation to validate the person's skills"
              />
            </ListItem>
          </List>
          <Typography variant='body2' sx={{ mt: 2, fontStyle: 'italic' }}>
            💡 Tip: Be honest and specific in your recommendations to help build trust in
            the system.
          </Typography>
        </Box>
      )
    },
    {
      id: 'viewing-credentials',
      title: 'Viewing & Sharing Credentials',
      icon: <VisibilityIcon />,
      content: (
        <Box>
          <Typography variant='h6' gutterBottom>
            How to View and Share Your Credentials
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Access Credential Details'
                secondary="Click on any credential from 'My Skills' to view comprehensive details"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Review All Information'
                secondary='See skill description, evidence, recommendations, and validation details'
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Copy Shareable Link'
                secondary='Use the share button to copy a link that others can use to view your credential'
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Export for Resumes'
                secondary='Download or copy credential information to include in job applications'
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary='Share on LinkedIn'
                secondary='Use the LinkedIn integration to showcase your verified skills on your profile'
              />
            </ListItem>
          </List>
          <Typography variant='body2' sx={{ mt: 2, fontStyle: 'italic' }}>
            💡 Tip: Share your credentials strategically to highlight your most relevant
            skills for each opportunity.
          </Typography>
        </Box>
      )
    }
  ]

  const faqItems = [
    {
      question: 'What are LinkedCreds?',
      answer:
        'LinkedCreds are verifiable digital credentials that showcase your skills, experiences, and achievements. They include evidence, recommendations from others, and are tamper-proof, making them trustworthy for employers and educational institutions.'
    },
    {
      question: 'How do I get started with LinkedCreds?',
      answer:
        "Simply sign in with your Google account, click 'Add a New Skill', and follow the step-by-step process to create your first credential. You can also import existing credentials using the 'Import Skill Credential' feature."
    },
    {
      question: 'What types of skills can I document?',
      answer:
        'You can document any skill or experience - from professional certifications to caregiving, volunteering, side projects, or on-the-job learning. LinkedCreds is designed to capture all types of valuable experiences.'
    },
    {
      question: 'How do recommendations work?',
      answer:
        "You can request recommendations from trusted contacts who can validate your skills. They'll receive an email with a link to review your credential and provide feedback, which adds credibility to your skills."
    },
    {
      question: 'Is my data secure?',
      answer:
        'Yes, LinkedCreds uses secure storage options including Google Drive integration. Your credentials are tamper-proof and you maintain full control over who can access your information.'
    },
    {
      question: 'Can I share my credentials with employers?',
      answer:
        'Absolutely! You can share individual credentials via links, export them for resumes, or integrate them with your LinkedIn profile to showcase your verified skills to potential employers.'
    },
    {
      question: 'What if I need help or have questions?',
      answer:
        'You can contact our support team at support@linkedcreds.allskillscount.org or refer to this help page for detailed instructions on using all features.'
    }
  ]

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <HelpIcon sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
        <Typography variant='h3' component='h1' gutterBottom sx={{ fontWeight: 'bold' }}>
          LinkedCreds Help Center
        </Typography>
        <Typography variant='h6' color='text.secondary'>
          Everything you need to know about creating, managing, and sharing your
          verifiable credentials
        </Typography>
      </Box>

      {/* Quick Start Guide */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant='h5' gutterBottom sx={{ fontWeight: 'bold' }}>
          🚀 Quick Start Guide
        </Typography>
        <Typography variant='body1' sx={{ mb: 3 }}>
          Get started with LinkedCreds in just 5 simple steps:
        </Typography>
        {quickStartSteps.map((step, index) => (
          <Box key={step.step} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                mr: 2,
                fontWeight: 'bold'
              }}
            >
              {step.step}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                {step.title}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {step.description}
              </Typography>
            </Box>
            <Box sx={{ ml: 2 }}>{step.icon}</Box>
          </Box>
        ))}
      </Paper>

      {/* Detailed Feature Instructions */}
      <Typography variant='h4' gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        📚 Detailed Instructions
      </Typography>

      {features.map(feature => (
        <Accordion
          key={feature.id}
          expanded={expandedAccordion === feature.id}
          onChange={handleAccordionChange(feature.id)}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 2, color: theme.palette.primary.main }}>{feature.icon}</Box>
              <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                {feature.title}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>{feature.content}</AccordionDetails>
        </Accordion>
      ))}

      {/* FAQ Section */}
      <Typography variant='h4' gutterBottom sx={{ fontWeight: 'bold', mt: 4, mb: 3 }}>
        ❓ Frequently Asked Questions
      </Typography>

      {faqItems.map((item, index) => (
        <Accordion
          key={index}
          expanded={expandedAccordion === `faq-${index}`}
          onChange={handleAccordionChange(`faq-${index}`)}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
              {item.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant='body1'>{item.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Contact Support */}
      <Paper elevation={2} sx={{ p: 3, mt: 4, textAlign: 'center' }}>
        <Typography variant='h5' gutterBottom sx={{ fontWeight: 'bold' }}>
          📞 Need More Help?
        </Typography>
        <Typography variant='body1' sx={{ mb: 2 }}>
          Can&apos;t find what you&apos;re looking for? Our support team is here to help!
        </Typography>
        <Button
          variant='contained'
          component={MuiLink}
          href='mailto:support@linkedcreds.allskillscount.org'
          sx={{
            backgroundColor: theme.palette.primary.main,
            '&:hover': { backgroundColor: theme.palette.primary.dark }
          }}
        >
          Contact Support
        </Button>
      </Paper>
    </Container>
  )
}

export default HelpPage
