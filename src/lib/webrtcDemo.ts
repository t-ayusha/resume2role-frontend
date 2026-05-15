export type WeRTCOfferResponse = {
  answer: string | null
  iceServers: RTCIceServer[]
  message?: string
}

export type WeRTCIceCandidate = {
  candidate: {
    candidate: string
    sdpMid?: string | null
    sdpMLineIndex?: number | null
  }
}

export async function postOfferToBackend(payload: {
  offer: { type: string; sdp: string }
}): Promise<WeRTCOfferResponse> {
  const apiUrl = `${import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'}`

  const res = await fetch(`${apiUrl}/webrtc/offer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.message || 'Failed to send WebRTC offer')
  }

  return (await res.json()) as WeRTCOfferResponse
}

export async function postIceCandidateToBackend(payload: {
  candidate: { candidate: string; sdpMid?: string | null; sdpMLineIndex?: number | null }
}): Promise<{ received: boolean; message?: string }> {
  const apiUrl = `${import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'}`

  const res = await fetch(`${apiUrl}/webrtc/ice-candidate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.message || 'Failed to send ICE candidate')
  }

  return (await res.json()) as { received: boolean; message?: string }
}

