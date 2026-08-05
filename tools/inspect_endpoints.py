import os
os.environ.setdefault("DEBUG", "true")
os.environ.setdefault("SECRET_KEY", "test-secret-key")
os.environ.setdefault("JWT_SECRET_KEY", "test-jwt-secret-key")
os.environ.setdefault("MONGODB_URI", "")
from scamshield import create_app
app = create_app()
print('\nRegistered before_request functions:')
for fn in app.before_request_funcs.get(None, []):
    print(' -', getattr(fn, '__name__', repr(fn)), 'module:', getattr(fn, '__module__', None))

print('\nRegistered before_app_request functions:')
for fn in app.before_request_funcs.get(None, []):
    print(' -', getattr(fn, '__name__', None))

print('\nThreat routes:')
for rule in sorted(app.url_map.iter_rules(), key=lambda r: r.rule):
    if '/api/threats' in rule.rule:
        print('RULE:', rule.rule)
        print('  endpoint:', rule.endpoint)
        vf = app.view_functions.get(rule.endpoint)
        print('  view_func:', vf)
        wrapped = getattr(vf, '__wrapped__', None)
        print('  wrapped:', wrapped)
        if wrapped:
            print('   wrapped name:', wrapped.__name__, 'module:', getattr(wrapped, '__module__', None))
        print('   globals contains login_required:', 'login_required' in (vf.__globals__ if hasattr(vf, '__globals__') else {}))
        print('')

from werkzeug.routing import MapAdapter
adapter = app.url_map.bind('localhost')
try:
    endpoint, args = adapter.match('/api/threats/domain/example.com', method='GET')
    print('Adapter matched endpoint:', endpoint, 'args:', args)
except Exception as e:
    print('Adapter match error:', e)
