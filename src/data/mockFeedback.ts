export const mockFeedback = {
  title: 'Feedback on the Interview — Frontend Developer Interview',
  score: '12/100',
  overallImpression:
    'Your responses showed some intent, but lacked specific examples and role-aligned impact. Focus on structured answers, clearer communication, and stronger confidence in expressing your frontend experience.',
  dateTime: new Date().toLocaleString(),
  verdict: 'Not Recommended',
  breakdown: [
    {
      title: 'Enthusiasm & Interest',
      score: '0/20',
      bullets: [
        'Energy in responses was flat and did not communicate excitement for the role.',
        'Missed opportunities to connect your interests with the company mission.',
      ],
    },
    {
      title: 'Communication Skills',
      score: '5/20',
      bullets: [
        'Responses were brief and lacked a clear beginning, middle, and conclusion.',
        'Technical points were mentioned, but not explained with practical examples.',
      ],
    },
    {
      title: 'Self Awareness & Reflection',
      score: '2/20',
      bullets: [
        'Limited reflection on strengths, growth areas, and lessons learned.',
        'Could improve by sharing one concrete challenge and how you handled it.',
      ],
    },
  ],
}
