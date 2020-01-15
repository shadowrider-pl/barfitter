package finbarre.service.serviceForUsers;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.CacheManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import finbarre.domain.Authority;
import finbarre.domain.User;
import finbarre.repository.UserRepository;
import finbarre.service.UserService;
import finbarre.service.dto.UserDTO;
import finbarre.service.util.RandomUtil;

/**
 * Additional service class for managing users.
 */
@Service
@Transactional
public class AdditionalUserService {



    private final PasswordEncoder passwordEncoder;

    private final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    private final CacheManager cacheManager;

    public AdditionalUserService(UserRepository userRepository, PasswordEncoder passwordEncoder, CacheManager cacheManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.cacheManager = cacheManager;
    }
    
    public User registerUserForRestaurant(UserDTO userDTO, String password) {

        User newUser = new User();
//        Authority authority = authorityRepository.findOne(AuthoritiesConstants.USER);
        final Set<Authority> authorities = new HashSet<>();
        String encryptedPassword = passwordEncoder.encode(password);
        newUser.setLogin(userDTO.getLogin());
        // new user gets initially a generated password
        newUser.setPassword(encryptedPassword);
        newUser.setFirstName(userDTO.getFirstName());
        newUser.setLastName(userDTO.getLastName());
        newUser.setEmail(userDTO.getEmail());
        newUser.setImageUrl(userDTO.getImageUrl());
        newUser.setLangKey(userDTO.getLangKey());
        newUser.setActivated(userDTO.isActivated());
        for(String a : userDTO.getAuthorities()){
        	final Authority auth = new Authority();
        	auth.setName(a);
        	authorities.add(auth);
        }
        newUser.setAuthorities(authorities);
        // new user gets registration key
        newUser.setActivationKey(RandomUtil.generateActivationKey());
//        authorities.add(authority);
//        newUser.setAuthorities(authorities);
        userRepository.save(newUser);
        cacheManager.getCache(UserRepository.USERS_BY_LOGIN_CACHE).evict(newUser.getLogin());
        cacheManager.getCache(UserRepository.USERS_BY_EMAIL_CACHE).evict(newUser.getEmail());
        log.debug("Created Information for User: {}", newUser);
        return newUser;
    }

}
