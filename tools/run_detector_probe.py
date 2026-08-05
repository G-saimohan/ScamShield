from scamshield.ai.detector import analyze_content
text = "Congratulations!\n\nYou won ₹50,000.\n\nClick below to claim.\n\nhttp://bit.ly/fake\n\nOffer expires today."
res = analyze_content(text, content_type='email')
print(res)
import inspect
print('analyze_content source:', inspect.getsource(analyze_content).splitlines()[0])
print('analyze_content file:', analyze_content.__code__.co_filename)
from scamshield.ai import detector
lt = text.lower()
print('lowered:', repr(lt))
print('urgency matches:', detector._contains_any(text, detector.URGENCY_TERMS))
print('reward matches:', detector._contains_any(text, detector.REWARD_TERMS))
print('email matches:', detector._contains_any(text, detector.EMAIL_TERMS))
print('shortener in text:', any(s in lt for s in detector.SHORTENERS))
