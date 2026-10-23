Pod::Spec.new do |s|
  s.name = 'LegathonMotionHistory'
  s.version = '1.0.0'
  s.summary = 'Account-routed walking history for Legathon Walk'
  s.description = 'Reads on-device Core Motion step and activity history.'
  s.license = { :type => 'Proprietary' }
  s.author = 'Legathon Walk LLC'
  s.homepage = 'https://legathonwalk.net'
  s.platforms = { :ios => '15.1' }
  s.source = { :git => '' }
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.frameworks = 'CoreMotion'
  s.swift_version = '5.9'
  s.source_files = '**/*.{h,m,mm,swift}'
end
